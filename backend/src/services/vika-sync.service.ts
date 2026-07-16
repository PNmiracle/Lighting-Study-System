import { config } from '../config';
import { prisma } from '../config/prisma';

/**
 * Vika 同步报告
 */
interface SyncReport {
  pulled: number;
  pushed: number;
  errors: string[];
}

/**
 * Vika 飞书看板同步适配器
 *
 * 可选模块，通过 VIKA_SYNC_ENABLED 环境变量控制。
 * 失败不影响主流程。
 */
export class VikaSyncAdapter {
  private enabled: boolean;
  private apiBase: string;
  private apiToken: string;

  constructor() {
    this.enabled = config.vikaSyncEnabled;
    this.apiBase = config.vikaApiBase;
    this.apiToken = config.vikaApiToken;
  }

  /**
   * 将本地新建任务同步到 Vika
   */
  async syncTaskToVika(task: any): Promise<void> {
    if (!this.enabled || !this.apiBase) return;
    if (task.vikaRecordId) return; // 已有 Vika 记录则跳过

    try {
      const response = await fetch(`${this.apiBase}/records`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          studentId: task.studentId,
          teacherId: task.teacherId,
          prompt: task.prompt,
          stage: task.stage,
          round: task.round,
          priority: task.priority,
        }),
      });

      if (response.ok) {
        const data = await response.json() as { recordId?: string };
        if (data.recordId) {
          await prisma.aiSelectionTask.update({
            where: { id: task.id },
            data: { vikaRecordId: data.recordId },
          });
        }
      } else {
        console.warn(`[VikaSync] 创建同步失败: ${response.status}`);
      }
    } catch (err: any) {
      console.warn('[VikaSync] syncTaskToVika 异常:', err.message);
    }
  }

  /**
   * 将执行进度同步到 Vika
   */
  async syncProgressToVika(task: any): Promise<void> {
    if (!this.enabled || !this.apiBase) return;
    if (!task.vikaRecordId) return;

    try {
      await fetch(`${this.apiBase}/records/${task.vikaRecordId}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({
          stage: task.stage,
          processingNode: task.processingNode,
          aiFeedback: task.aiFeedback,
          confidence: task.confidence,
        }),
      });
    } catch (err: any) {
      console.warn('[VikaSync] syncProgressToVika 异常:', err.message);
    }
  }

  /**
   * 将最终结果同步到 Vika（完成后）
   */
  async syncResultToVika(task: any): Promise<void> {
    if (!this.enabled || !this.apiBase) return;
    if (!task.vikaRecordId) return;

    try {
      await fetch(`${this.apiBase}/records/${task.vikaRecordId}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({
          stage: 'COMPLETED',
          resultSupervisorIds: task.resultSupervisorIds,
          endedAt: task.endedAt,
        }),
      });
    } catch (err: any) {
      console.warn('[VikaSync] syncResultToVika 异常:', err.message);
    }
  }

  /**
   * 从 Vika 拉取新任务
   */
  async syncTaskFromVika(vikaRecordId: string): Promise<Record<string, any> | null> {
    if (!this.enabled || !this.apiBase) return null;

    try {
      const response = await fetch(`${this.apiBase}/records/${vikaRecordId}`, {
        headers: this.getHeaders(),
      });
      if (response.ok) {
        return await response.json() as Record<string, any>;
      }
    } catch (err: any) {
      console.warn('[VikaSync] syncTaskFromVika 异常:', err.message);
    }
    return null;
  }

  /**
   * 批量双向同步（定时任务触发）
   */
  async batchSyncPending(): Promise<SyncReport> {
    const report: SyncReport = { pulled: 0, pushed: 0, errors: [] };

    if (!this.enabled || !this.apiBase) {
      report.errors.push('Vika 同步未启用');
      return report;
    }

    try {
      // 1. 从 Vika 拉取新任务
      const vikaResponse = await fetch(`${this.apiBase}/records?filter=stage=NOT_STARTED`, {
        headers: this.getHeaders(),
      });
      if (vikaResponse.ok) {
        const vikaRecords = await vikaResponse.json() as { records?: any[] };
        if (vikaRecords.records) {
          for (const record of vikaRecords.records) {
            // 检查本地是否已存在
            const existing = await prisma.aiSelectionTask.findFirst({
              where: { vikaRecordId: record.id },
            });
            if (!existing) {
              report.pulled++;
            }
          }
        }
      }

      // 2. 推送本地更新到 Vika
      const recentTasks = await prisma.aiSelectionTask.findMany({
        where: {
          vikaRecordId: { not: null },
          updatedAt: { gte: new Date(Date.now() - 5 * 60 * 1000) }, // 最近5分钟
        },
      });

      for (const task of recentTasks) {
        try {
          await this.syncProgressToVika(task);
          report.pushed++;
        } catch (err: any) {
          report.errors.push(`推送任务 ${task.id} 失败: ${err.message}`);
        }
      }
    } catch (err: any) {
      report.errors.push(`批量同步异常: ${err.message}`);
    }

    return report;
  }

  /**
   * 构建请求头
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.apiToken) {
      headers['Authorization'] = `Bearer ${this.apiToken}`;
    }
    return headers;
  }
}

export const vikaSyncAdapter = new VikaSyncAdapter();
