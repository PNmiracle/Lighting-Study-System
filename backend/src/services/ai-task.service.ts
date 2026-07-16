import { prisma } from '../config/prisma';
import { BusinessError } from '../middleware/error';
import {
  ErrorCode,
  AiTaskSummary,
  AiTaskDetail,
  CreateAiTaskInput,
  UpdateAiTaskInput,
  ResultSupervisorEntry,
} from '../types';
import { Role, AiTaskStage, AiTaskRound, AiTaskPriority, AiConfidence, MatchLevel, Prisma } from '@prisma/client';
import { aiExecutionService } from './ai-execution.service';
import { vikaSyncAdapter } from './vika-sync.service';

/**
 * AI 选导任务服务
 * 处理 AI 任务 CRUD + 状态机流转 + 完成→Assignment 创建
 */
export class AiTaskService {
  private readonly PROMPT_TRUNCATE_LENGTH = 100;

  /**
   * 格式化任务为摘要（列表项）
   */
  private formatSummary(task: any): AiTaskSummary {
    return {
      id: task.id,
      studentId: task.studentId,
      studentName: task.student?.user?.name || '',
      teacherId: task.teacherId,
      teacherName: task.teacher?.user?.name || '',
      prompt: task.prompt?.substring(0, this.PROMPT_TRUNCATE_LENGTH) + (task.prompt?.length > this.PROMPT_TRUNCATE_LENGTH ? '...' : ''),
      stage: task.stage,
      round: task.round,
      priority: task.priority,
      confidence: task.confidence,
      errorCount: task.errorCount,
      processingNode: task.processingNode,
      lockedAt: task.lockedAt?.toISOString() || null,
      startedAt: task.startedAt?.toISOString() || null,
      endedAt: task.endedAt?.toISOString() || null,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }

  /**
   * 格式化任务为详情
   */
  private formatDetail(task: any): AiTaskDetail {
    const resultSupervisorIds = task.resultSupervisorIds as ResultSupervisorEntry[] | null;
    return {
      ...this.formatSummary(task),
      prompt: task.prompt,
      aiFeedback: task.aiFeedback,
      failureReason: task.failureReason,
      resultSupervisorIds,
      vikaRecordId: task.vikaRecordId,
      student: {
        id: task.student.id,
        name: task.student.user?.name || '',
        grade: task.student.grade,
        targetCountry: task.student.targetCountry,
        targetMajor: task.student.targetMajor,
      },
    };
  }

  /**
   * 创建 AI 任务
   */
  async create(data: CreateAiTaskInput, userId: string, role: Role): Promise<AiTaskDetail> {
    // 获取老师的 Teacher 记录
    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    if (!teacher) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '老师记录不存在', 404);
    }

    // 校验学生是否存在
    const student = await prisma.student.findUnique({
      where: { id: data.studentId },
      include: { user: true },
    });
    if (!student) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '学生不存在', 404);
    }

    // 老师只能为自己名下的学生创建任务（Admin 不受限）
    if (role === Role.TEACHER && student.assignedTeacherId !== teacher.id) {
      throw new BusinessError(ErrorCode.FORBIDDEN, '该学生未分配给您，无法创建 AI 任务', 403);
    }

    const task = await prisma.aiSelectionTask.create({
      data: {
        studentId: data.studentId,
        teacherId: teacher.id,
        prompt: data.prompt,
        round: data.round || AiTaskRound.FIRST,
        priority: data.priority || AiTaskPriority.P1,
        vikaRecordId: data.vikaRecordId || null,
        stage: AiTaskStage.NOT_STARTED,
      },
      include: {
        student: { include: { user: true } },
        teacher: { include: { user: true } },
      },
    });

    // 可选：Vika 同步
    vikaSyncAdapter.syncTaskToVika(task).catch((err) => {
      console.warn('[VikaSync] 创建任务同步失败:', err.message);
    });

    return this.formatDetail(task);
  }

  /**
   * 获取任务列表（支持多维度筛选）
   */
  async list(
    role: Role,
    userId: string,
    filters: {
      stage?: AiTaskStage;
      round?: AiTaskRound;
      priority?: AiTaskPriority;
      teacherId?: string;
      studentId?: string;
      page?: number;
      pageSize?: number;
    }
  ): Promise<{ items: AiTaskSummary[]; total: number }> {
    const where: Prisma.AiSelectionTaskWhereInput = {};

    // 角色隔离
    if (role === Role.TEACHER) {
      const teacher = await prisma.teacher.findUnique({ where: { userId } });
      if (!teacher) return { items: [], total: 0 };
      where.teacherId = teacher.id;
    }
    // Admin 可看全部

    if (filters.stage) where.stage = filters.stage;
    if (filters.round) where.round = filters.round;
    if (filters.priority) where.priority = filters.priority;
    if (filters.teacherId) where.teacherId = filters.teacherId;
    if (filters.studentId) where.studentId = filters.studentId;

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 50;
    const skip = (page - 1) * pageSize;

    const [tasks, total] = await Promise.all([
      prisma.aiSelectionTask.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          student: { include: { user: true } },
          teacher: { include: { user: true } },
        },
      }),
      prisma.aiSelectionTask.count({ where }),
    ]);

    return {
      items: tasks.map((t) => this.formatSummary(t)),
      total,
    };
  }

  /**
   * 获取任务详情
   */
  async getById(taskId: string, role: Role, userId: string): Promise<AiTaskDetail> {
    const task = await prisma.aiSelectionTask.findUnique({
      where: { id: taskId },
      include: {
        student: { include: { user: true } },
        teacher: { include: { user: true } },
      },
    });

    if (!task) {
      throw new BusinessError(ErrorCode.AI_TASK_NOT_FOUND, 'AI 任务不存在', 404);
    }

    // 权限隔离：老师只能看自己创建的任务
    if (role === Role.TEACHER) {
      const teacher = await prisma.teacher.findUnique({ where: { userId } });
      if (!teacher || task.teacherId !== teacher.id) {
        throw new BusinessError(ErrorCode.FORBIDDEN, '无权查看此 AI 任务', 403);
      }
    }

    return this.formatDetail(task);
  }

  /**
   * 更新任务字段
   */
  async update(
    taskId: string,
    data: UpdateAiTaskInput,
    role: Role,
    userId: string
  ): Promise<AiTaskDetail> {
    const task = await prisma.aiSelectionTask.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new BusinessError(ErrorCode.AI_TASK_NOT_FOUND, 'AI 任务不存在', 404);
    }

    // 权限隔离
    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    if (!teacher || task.teacherId !== teacher.id) {
      if (role !== Role.ADMIN) {
        throw new BusinessError(ErrorCode.FORBIDDEN, '无权修改此 AI 任务', 403);
      }
    }

    const updateData: Prisma.AiSelectionTaskUpdateInput = {};
    if (data.prompt !== undefined) updateData.prompt = data.prompt;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.round !== undefined) updateData.round = data.round;
    if (data.stage !== undefined) {
      // 仅允许手动设为 NOT_STARTED 或 PAUSED
      updateData.stage = data.stage as AiTaskStage;
    }
    if (data.failureReason !== undefined) updateData.failureReason = data.failureReason;

    const updated = await prisma.aiSelectionTask.update({
      where: { id: taskId },
      data: updateData,
      include: {
        student: { include: { user: true } },
        teacher: { include: { user: true } },
      },
    });

    return this.formatDetail(updated);
  }

  /**
   * 触发 AI 异步执行
   */
  async execute(taskId: string, role: Role, userId: string, forceRerun: boolean = false): Promise<{ taskId: string; status: string }> {
    const task = await prisma.aiSelectionTask.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new BusinessError(ErrorCode.AI_TASK_NOT_FOUND, 'AI 任务不存在', 404);
    }

    // 权限隔离
    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    if (!teacher || task.teacherId !== teacher.id) {
      if (role !== Role.ADMIN) {
        throw new BusinessError(ErrorCode.FORBIDDEN, '无权执行此 AI 任务', 403);
      }
    }

    // 状态检查：仅 NOT_STARTED 或 PAUSED 可执行（forceRerun 跳过）
    if (!forceRerun && task.stage !== AiTaskStage.NOT_STARTED && task.stage !== AiTaskStage.PAUSED) {
      throw new BusinessError(ErrorCode.AI_TASK_IN_EXECUTION, 'AI 任务正在执行中，不可重复触发', 409);
    }

    // 并发保护：检查 locked_at
    if (task.lockedAt) {
      const lockAge = Date.now() - task.lockedAt.getTime();
      const timeoutMs = 30 * 60 * 1000; // 30分钟
      if (lockAge < timeoutMs) {
        throw new BusinessError(ErrorCode.AI_TASK_LOCKED, 'AI 任务已锁定（并发保护）', 409);
      }
      // 超时自动解除
    }

    // 更新状态为 AI_PROCESSING 并锁定
    await prisma.aiSelectionTask.update({
      where: { id: taskId },
      data: {
        stage: AiTaskStage.AI_PROCESSING,
        lockedAt: new Date(),
        startedAt: new Date(),
        processingNode: 'searching_supervisors',
        aiFeedback: '正在进行导师搜索...',
        errorCount: forceRerun ? 0 : task.errorCount, // forceRerun 时重置错误计数
      },
    });

    // 异步启动执行（不阻塞）
    aiExecutionService.startExecution(taskId).catch((err) => {
      console.error(`[AI Execution] 任务 ${taskId} 异步执行异常:`, err);
    });

    return { taskId, status: 'queued' };
  }

  /**
   * 老师审核（通过/驳回）
   */
  async review(
    taskId: string,
    action: 'APPROVE' | 'REJECT',
    feedback: string | undefined,
    role: Role,
    userId: string
  ): Promise<AiTaskDetail> {
    const task = await prisma.aiSelectionTask.findUnique({
      where: { id: taskId },
      include: {
        student: { include: { user: true } },
        teacher: { include: { user: true } },
      },
    });

    if (!task) {
      throw new BusinessError(ErrorCode.AI_TASK_NOT_FOUND, 'AI 任务不存在', 404);
    }

    // 权限隔离
    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    if (!teacher || task.teacherId !== teacher.id) {
      if (role !== Role.ADMIN) {
        throw new BusinessError(ErrorCode.FORBIDDEN, '无权审核此 AI 任务', 403);
      }
    }

    // 状态检查：仅 HUMAN_REVIEW 可审核
    if (task.stage !== AiTaskStage.HUMAN_REVIEW) {
      throw new BusinessError(ErrorCode.AI_TASK_NOT_REVIEWABLE, 'AI 任务不在可审核状态', 409);
    }

    if (action === 'APPROVE') {
      return this.completeTask(task, feedback, teacher.id);
    } else {
      return this.rejectTask(task, feedback);
    }
  }

  /**
   * 审核通过：完成→创建 Assignment
   */
  private async completeTask(task: any, feedback: string | undefined, teacherId: string): Promise<AiTaskDetail> {
    const resultEntries = task.resultSupervisorIds as ResultSupervisorEntry[] | null;
    const createdAssignments: { id: string; supervisorId: string; supervisorName: string }[] = [];

    if (resultEntries && resultEntries.length > 0) {
      for (const entry of resultEntries) {
        // 检查是否已存在推荐记录（去重）
        const existing = await prisma.supervisorAssignment.findUnique({
          where: {
            studentId_supervisorId: {
              studentId: task.studentId,
              supervisorId: entry.supervisorId,
            },
          },
        });

        const matchLevel: MatchLevel = entry.matchScore >= 0.7 ? MatchLevel.HIGH : MatchLevel.MEDIUM;
        const notes = feedback
          ? `${entry.matchNotes}\n[审核备注] ${feedback}`
          : entry.matchNotes;

        if (existing) {
          // 已存在：更新 notes（追加本轮 matchNotes）
          const updated = await prisma.supervisorAssignment.update({
            where: { id: existing.id },
            data: {
              notes: `${existing.notes || ''}\n---\n[AI 选导 ${new Date().toISOString()}] ${notes}`,
              matchLevel,
            },
          });
          createdAssignments.push({
            id: updated.id,
            supervisorId: entry.supervisorId,
            supervisorName: entry.supervisorName,
          });
        } else {
          // 不存在：新建
          const created = await prisma.supervisorAssignment.create({
            data: {
              studentId: task.studentId,
              supervisorId: entry.supervisorId,
              teacherId,
              notes,
              matchLevel,
            },
          });
          createdAssignments.push({
            id: created.id,
            supervisorId: entry.supervisorId,
            supervisorName: entry.supervisorName,
          });
        }
      }
    }

    // 更新任务状态为 COMPLETED
    const aiFeedback = feedback
      ? `${task.aiFeedback || ''}\n[审核通过] ${feedback}`
      : task.aiFeedback;

    const updated = await prisma.aiSelectionTask.update({
      where: { id: task.id },
      data: {
        stage: AiTaskStage.COMPLETED,
        endedAt: new Date(),
        lockedAt: null,
        aiFeedback,
      },
      include: {
        student: { include: { user: true } },
        teacher: { include: { user: true } },
      },
    });

    const detail = this.formatDetail(updated);
    detail.createdAssignments = createdAssignments;

    // 可选：Vika 同步
    vikaSyncAdapter.syncResultToVika(updated).catch((err) => {
      console.warn('[VikaSync] 审核通过同步失败:', err.message);
    });

    return detail;
  }

  /**
   * 审核驳回：回退到 NOT_STARTED（或 errorCount≥3 → PAUSED）
   */
  private async rejectTask(task: any, feedback: string | undefined): Promise<AiTaskDetail> {
    const newErrorCount = task.errorCount + 1;
    const rejectionNote = feedback ? `\n[驳回] ${feedback}` : '\n[驳回] 老师驳回了 AI 搜索结果';

    // 错误次数 ≥ 3 → PAUSED
    if (newErrorCount >= 3) {
      const updated = await prisma.aiSelectionTask.update({
        where: { id: task.id },
        data: {
          stage: AiTaskStage.PAUSED,
          errorCount: newErrorCount,
          failureReason: '累计错误次数过多，请人工检查',
          aiFeedback: (task.aiFeedback || '') + rejectionNote,
          resultSupervisorIds: Prisma.DbNull, // 清空结果
          lockedAt: null,
        },
        include: {
          student: { include: { user: true } },
          teacher: { include: { user: true } },
        },
      });
      return this.formatDetail(updated);
    }

    // errorCount < 3 → NOT_STARTED（可重试）
    const updated = await prisma.aiSelectionTask.update({
      where: { id: task.id },
      data: {
        stage: AiTaskStage.NOT_STARTED,
        errorCount: newErrorCount,
        aiFeedback: (task.aiFeedback || '') + rejectionNote,
        resultSupervisorIds: Prisma.DbNull,
        lockedAt: null,
        processingNode: null,
        endedAt: null,
      },
      include: {
        student: { include: { user: true } },
        teacher: { include: { user: true } },
      },
    });

    return this.formatDetail(updated);
  }

  /**
   * 删除任务（仅 NOT_STARTED / COMPLETED / PAUSED 状态可删除）
   */
  async delete(taskId: string, role: Role, userId: string): Promise<{ success: true }> {
    const task = await prisma.aiSelectionTask.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new BusinessError(ErrorCode.AI_TASK_NOT_FOUND, 'AI 任务不存在', 404);
    }

    // 权限隔离
    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    if (!teacher || task.teacherId !== teacher.id) {
      if (role !== Role.ADMIN) {
        throw new BusinessError(ErrorCode.FORBIDDEN, '无权删除此 AI 任务', 403);
      }
    }

    // 仅允许删除 NOT_STARTED / COMPLETED / PAUSED 状态的任务
    const deletableStages: AiTaskStage[] = [AiTaskStage.NOT_STARTED, AiTaskStage.COMPLETED, AiTaskStage.PAUSED];
    if (!deletableStages.includes(task.stage)) {
      throw new BusinessError(ErrorCode.AI_TASK_IN_EXECUTION, '执行中的任务不可删除', 409);
    }

    await prisma.aiSelectionTask.delete({ where: { id: taskId } });
    return { success: true };
  }
}

export const aiTaskService = new AiTaskService();
