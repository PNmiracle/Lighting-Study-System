import client from './client';
import type {
  PaginatedResponse,
  AiTaskSummary,
  AiTaskDetail,
  CreateAiTaskInput,
  UpdateAiTaskInput,
  ReviewInput,
} from '../types';

/**
 * AI 选导任务 API 请求层
 */
export const aiTasksApi = {
  /** POST /api/ai-tasks — 创建 AI 选导任务 */
  create: (data: CreateAiTaskInput): Promise<AiTaskDetail> => {
    return client.post('/ai-tasks', data);
  },

  /** GET /api/ai-tasks — 获取任务列表（支持多维筛选） */
  list: (params?: {
    stage?: string;
    round?: string;
    priority?: string;
    teacherId?: string;
    studentId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<AiTaskSummary>> => {
    return client.get('/ai-tasks', { params });
  },

  /** GET /api/ai-tasks/:id — 获取任务详情 */
  getById: (id: string): Promise<AiTaskDetail> => {
    return client.get(`/ai-tasks/${id}`);
  },

  /** PATCH /api/ai-tasks/:id — 更新任务字段 */
  update: (id: string, data: UpdateAiTaskInput): Promise<AiTaskDetail> => {
    return client.patch(`/ai-tasks/${id}`, data);
  },

  /** POST /api/ai-tasks/:id/execute — 触发 AI 异步执行 */
  execute: (id: string, forceRerun?: boolean): Promise<{ taskId: string; status: string }> => {
    return client.post(`/ai-tasks/${id}/execute`, { forceRerun });
  },

  /** PATCH /api/ai-tasks/:id/review — 审核（通过/驳回） */
  review: (id: string, data: ReviewInput): Promise<AiTaskDetail> => {
    return client.patch(`/ai-tasks/${id}/review`, data);
  },

  /** DELETE /api/ai-tasks/:id — 删除任务 */
  remove: (id: string): Promise<{ success: true }> => {
    return client.delete(`/ai-tasks/${id}`);
  },
};
