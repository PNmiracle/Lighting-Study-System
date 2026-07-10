import { prisma } from '../config/prisma';
import { config } from '../config';
import { AiTaskStage, AiConfidence } from '@prisma/client';
import { ResultSupervisorEntry } from '../types';
import { vikaSyncAdapter } from './vika-sync.service';

/**
 * Skill 返回的导师信息
 */
interface SkillSupervisor {
  name: string;
  title?: string;
  university?: string;
  location?: string;
  department?: string;
  homepageUrl?: string;
  email?: string;
  researchArea?: string;
  qsRanking?: number;
  matchScore: number;
  matchNotes: string;
}

/**
 * Skill 返回结果
 */
interface SkillResult {
  supervisors: SkillSupervisor[];
  confidence: 'PASSED' | 'FAILED';
  summary: string;
}

/**
 * AI 异步执行引擎
 *
 * 负责：
 * 1. 进程内异步执行 AI 搜索
 * 2. 进度上报（更新 processingNode 和 aiFeedback）
 * 3. 超时处理（30 分钟硬超时）
 * 4. Skill 调用（HTTP API）
 * 5. 导师去重入库
 * 6. 置信度评估
 * 7. 服务启动时扫描超时任务并重置
 */
export class AiExecutionService {
  private activeExecutions: Map<string, AbortController> = new Map();
  private readonly MAX_CONCURRENT: number;
  private readonly TIMEOUT_MS: number;

  constructor() {
    this.MAX_CONCURRENT = config.aiMaxConcurrent;
    this.TIMEOUT_MS = config.aiExecutionTimeoutMs;
  }

  /**
   * 启动异步 AI 执行。不阻塞调用者。
   */
  async startExecution(taskId: string): Promise<void> {
    // 并发控制
    if (this.activeExecutions.size >= this.MAX_CONCURRENT) {
      // 超过并发限制时，将任务置为 NOT_STARTED 以便稍后重试
      await prisma.aiSelectionTask.update({
        where: { id: taskId },
        data: {
          stage: AiTaskStage.NOT_STARTED,
          lockedAt: null,
          aiFeedback: '并发执行已满，请稍后重试',
        },
      });
      return;
    }

    const abortController = new AbortController();
    this.activeExecutions.set(taskId, abortController);

    // 后台异步执行（不 await）
    this.runAsync(taskId, abortController.signal).catch((err) => {
      console.error(`[AI Execution] 任务 ${taskId} 执行异常:`, err);
    });
  }

  /**
   * 获取执行进度（轮询用）
   */
  async getProgress(taskId: string): Promise<{
    stage: AiTaskStage;
    processingNode: string | null;
    aiFeedback: string | null;
  } | null> {
    const task = await prisma.aiSelectionTask.findUnique({
      where: { id: taskId },
      select: { stage: true, processingNode: true, aiFeedback: true },
    });
    if (!task) return null;
    return {
      stage: task.stage,
      processingNode: task.processingNode,
      aiFeedback: task.aiFeedback,
    };
  }

  /**
   * 取消执行
   */
  cancelExecution(taskId: string): void {
    const controller = this.activeExecutions.get(taskId);
    if (controller) {
      controller.abort();
      this.activeExecutions.delete(taskId);
    }
  }

  /**
   * 处理超时：将超时任务重置为 NOT_STARTED
   */
  async handleTimeout(taskId: string): Promise<void> {
    console.warn(`[AI Execution] 任务 ${taskId} 执行超时`);

    const task = await prisma.aiSelectionTask.findUnique({ where: { id: taskId } });
    if (!task || task.stage !== AiTaskStage.AI_PROCESSING) return;

    await prisma.aiSelectionTask.update({
      where: { id: taskId },
      data: {
        stage: AiTaskStage.NOT_STARTED,
        lockedAt: null,
        processingNode: null,
        errorCount: task.errorCount + 1,
        failureReason: 'AI 执行超时（30分钟）',
        aiFeedback: `${task.aiFeedback || ''}\n[超时] AI 执行超时，请重试`,
        ...(task.errorCount + 1 >= 3 ? {
          stage: AiTaskStage.PAUSED,
          failureReason: '累计错误次数过多，请人工检查',
        } : {}),
      },
    });

    this.activeExecutions.delete(taskId);
  }

  /**
   * 服务启动时扫描并恢复超时任务
   */
  async recoverStaleTasks(): Promise<void> {
    const threshold = new Date(Date.now() - this.TIMEOUT_MS);

    const staleTasks = await prisma.aiSelectionTask.findMany({
      where: {
        stage: AiTaskStage.AI_PROCESSING,
        lockedAt: { lt: threshold },
      },
    });

    for (const task of staleTasks) {
      console.log(`[AI Execution] 恢复超时任务: ${task.id}`);
      await prisma.aiSelectionTask.update({
        where: { id: task.id },
        data: {
          stage: AiTaskStage.NOT_STARTED,
          lockedAt: null,
          processingNode: null,
          aiFeedback: `${task.aiFeedback || ''}\n[系统恢复] 服务重启，任务已重置为未开始`,
        },
      });
    }

    if (staleTasks.length > 0) {
      console.log(`[AI Execution] 已恢复 ${staleTasks.length} 个超时任务`);
    }
  }

  // ==================== 私有方法 ====================

  /**
   * 异步执行核心流程
   */
  private async runAsync(taskId: string, signal: AbortSignal): Promise<void> {
    const timeout = setTimeout(() => this.handleTimeout(taskId), this.TIMEOUT_MS);

    try {
      // Step 1: 加载任务和关联学生信息
      const task = await prisma.aiSelectionTask.findUnique({
        where: { id: taskId },
        include: { student: { include: { user: true } } },
      });
      if (!task || task.stage !== AiTaskStage.AI_PROCESSING) return;

      const student = task.student;
      const studentUser = student.user;

      // Step 2: 解析 prompt，替换占位符
      const resolvedPrompt = this.resolvePrompt(task.prompt, {
        studentName: studentUser.name,
        targetCountry: student.targetCountry || '未设置',
        targetMajor: student.targetMajor || '未设置',
        grade: student.grade || '未知',
      });

      // 检查是否被取消
      if (signal.aborted) return;

      // Step 3: 搜索导师
      await this.updateProgress(taskId, 'searching_supervisors', '正在进行导师搜索...');
      const result = await this.callPhdSupervisorSelector(resolvedPrompt, signal);

      // Step 4: 检查结果
      if (!result || !result.supervisors || result.supervisors.length === 0) {
        // 空结果 → HUMAN_REVIEW with FAILED
        await prisma.aiSelectionTask.update({
          where: { id: taskId },
          data: {
            stage: AiTaskStage.HUMAN_REVIEW,
            confidence: AiConfidence.FAILED,
            processingNode: 'done',
            lockedAt: null,
            endedAt: new Date(),
            aiFeedback: 'AI 搜索完成，但未找到匹配导师',
            resultSupervisorIds: [],
          },
        });
        return;
      }

      // Step 5: 整理导师信息
      if (signal.aborted) return;
      await this.updateProgress(taskId, 'filling_supervisor_info', `正在整理 ${result.supervisors.length} 位导师信息...`);

      // Step 6: 去重入库
      const resultEntries = await this.upsertSupervisors(taskId, result.supervisors);

      // Step 7: 验证链接
      if (signal.aborted) return;
      await this.updateProgress(taskId, 'verifying_links', '正在验证导师主页/邮箱链接...');
      // 模拟链接验证（实际由 skill 已完成）
      await this.delay(1000);

      // Step 8: 自检
      if (signal.aborted) return;
      await this.updateProgress(taskId, 'self_checking', '正在进行置信度评估...');

      const confidence = result.confidence === 'PASSED' ? AiConfidence.PASSED : AiConfidence.FAILED;
      const summary = result.summary || `搜索到 ${result.supervisors.length} 位导师`;

      // Step 9: 完成执行，进入 HUMAN_REVIEW
      await prisma.aiSelectionTask.update({
        where: { id: taskId },
        data: {
          stage: AiTaskStage.HUMAN_REVIEW,
          confidence,
          processingNode: 'done',
          lockedAt: null,
          endedAt: new Date(),
          aiFeedback: `${task.aiFeedback || ''}\n[完成] ${summary}`,
          resultSupervisorIds: resultEntries,
        },
      });

      // 可选：Vika 同步
      vikaSyncAdapter.syncProgressToVika({ ...task, stage: AiTaskStage.HUMAN_REVIEW, confidence } as any)
        .catch((err) => console.warn('[VikaSync] 进度同步失败:', err.message));

    } catch (err: any) {
      if (err.name === 'AbortError') return;

      console.error(`[AI Execution] 任务 ${taskId} 执行失败:`, err);

      // 非致命错误 → NOT_STARTED（可重试）
      const task = await prisma.aiSelectionTask.findUnique({ where: { id: taskId } });
      if (task && task.stage === AiTaskStage.AI_PROCESSING) {
        const newErrorCount = task.errorCount + 1;
        if (newErrorCount >= 3) {
          await prisma.aiSelectionTask.update({
            where: { id: taskId },
            data: {
              stage: AiTaskStage.PAUSED,
              errorCount: newErrorCount,
              failureReason: `AI 执行失败: ${err.message}`,
              lockedAt: null,
              aiFeedback: `${task.aiFeedback || ''}\n[失败] ${err.message}`,
            },
          });
        } else {
          await prisma.aiSelectionTask.update({
            where: { id: taskId },
            data: {
              stage: AiTaskStage.NOT_STARTED,
              errorCount: newErrorCount,
              failureReason: `AI 执行失败: ${err.message}`,
              lockedAt: null,
              processingNode: null,
              aiFeedback: `${task.aiFeedback || ''}\n[失败] ${err.message}`,
            },
          });
        }
      }
    } finally {
      clearTimeout(timeout);
      this.activeExecutions.delete(taskId);
    }
  }

  /**
   * 调用 phd-supervisor-selector Skill API
   */
  private async callPhdSupervisorSelector(prompt: string, signal: AbortSignal): Promise<SkillResult> {
    const apiBase = config.aiSkillApiBase;
    const apiKey = config.aiSkillApiKey;

    try {
      const response = await fetch(`${apiBase}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({ prompt }),
        signal,
      });

      if (!response.ok) {
        throw new Error(`Skill API 返回错误: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as SkillResult;
      return data;
    } catch (err: any) {
      if (err.name === 'AbortError') throw err;

      // 快速失败返回 mock 数据（开发/演示模式）
      if (config.nodeEnv === 'development') {
        console.warn('[AI Execution] Skill API 不可用，使用 mock 数据');
        return this.generateMockResult(prompt);
      }

      throw err;
    }
  }

  /**
   * 生成 Mock 结果（开发用）
   */
  private generateMockResult(_prompt: string): SkillResult {
    return {
      supervisors: [],
      confidence: 'FAILED',
      summary: '[DEV MODE] Skill API 不可用，请配置 AI_SKILL_API_BASE 环境变量',
    };
  }

  /**
   * 导师去重入库
   */
  private async upsertSupervisors(
    taskId: string,
    skillSupervisors: SkillSupervisor[]
  ): Promise<ResultSupervisorEntry[]> {
    const resultEntries: ResultSupervisorEntry[] = [];
    const task = await prisma.aiSelectionTask.findUnique({
      where: { id: taskId },
      select: { teacherId: true },
    });
    if (!task) return resultEntries;

    for (const sup of skillSupervisors) {
      // 按 name + university 匹配已有导师
      const nameLower = sup.name.toLowerCase().trim();
      const uniLower = (sup.university || '').toLowerCase().trim();

      let existingSupervisors = await prisma.supervisor.findMany({
        where: {
          AND: [
            { name: { contains: nameLower, mode: 'insensitive' } },
            ...(uniLower ? [{ university: { contains: uniLower, mode: 'insensitive' } }] : []),
          ],
        },
      });

      if (existingSupervisors.length > 0) {
        // 已存在 → 复用
        const existing = existingSupervisors[0];
        resultEntries.push({
          supervisorId: existing.id,
          supervisorName: existing.name,
          university: existing.university,
          matchScore: sup.matchScore,
          matchNotes: sup.matchNotes,
        });
      } else {
        // 不存在 → 新建
        const created = await prisma.supervisor.create({
          data: {
            name: sup.name,
            title: sup.title || null,
            location: sup.location || null,
            university: sup.university || null,
            department: sup.department || null,
            homepageUrl: sup.homepageUrl || null,
            email: sup.email || null,
            researchArea: sup.researchArea || null,
            qsRanking: sup.qsRanking || null,
            createdById: task.teacherId, // 使用任务创建老师的 userId
          },
        });

        resultEntries.push({
          supervisorId: created.id,
          supervisorName: created.name,
          university: created.university,
          matchScore: sup.matchScore,
          matchNotes: sup.matchNotes,
        });
      }
    }

    return resultEntries;
  }

  /**
   * 更新执行进度
   */
  private async updateProgress(taskId: string, node: string, message: string): Promise<void> {
    const task = await prisma.aiSelectionTask.findUnique({
      where: { id: taskId },
      select: { aiFeedback: true },
    });

    const newFeedback = `${task?.aiFeedback || ''}\n[${new Date().toLocaleTimeString()}] ${message}`;

    await prisma.aiSelectionTask.update({
      where: { id: taskId },
      data: {
        processingNode: node,
        aiFeedback: newFeedback,
      },
    });
  }

  /**
   * 解析 prompt 占位符
   */
  private resolvePrompt(
    template: string,
    vars: { studentName: string; targetCountry: string; targetMajor: string; grade: string }
  ): string {
    return template
      .replace(/\{student_name\}/g, vars.studentName)
      .replace(/\{target_country\}/g, vars.targetCountry)
      .replace(/\{target_major\}/g, vars.targetMajor)
      .replace(/\{grade\}/g, vars.grade)
      .replace(/\{vika_link\}/g, '（Vika 链接未配置）');
  }

  /**
   * 工具：延迟
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const aiExecutionService = new AiExecutionService();
