import { Response } from 'express';
import { AuthedRequest } from '../types';
import { aiTaskService } from '../services/ai-task.service';
import { createAiTaskSchema, updateAiTaskSchema, reviewAiTaskSchema } from '../utils/validation';
import { sendSuccess } from '../utils/response';
import { BusinessError } from '../middleware/error';
import { ErrorCode } from '../types';
import { AiTaskStage, AiTaskRound, AiTaskPriority } from '@prisma/client';

/**
 * AI 选导任务控制器
 */
export class AiTaskController {
  /**
   * POST /api/ai-tasks
   * 创建 AI 选导任务
   */
  async create(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const data = createAiTaskSchema.parse(req.body);
    const task = await aiTaskService.create(data, req.user.userId, req.user.role);
    sendSuccess(res, task);
  }

  /**
   * GET /api/ai-tasks
   * 获取任务列表（支持多维度筛选）
   */
  async list(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const stage = req.query.stage as AiTaskStage | undefined;
    const round = req.query.round as AiTaskRound | undefined;
    const priority = req.query.priority as AiTaskPriority | undefined;
    const teacherId = req.query.teacherId as string | undefined;
    const studentId = req.query.studentId as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined;

    const result = await aiTaskService.list(req.user.role, req.user.userId, {
      stage,
      round,
      priority,
      teacherId,
      studentId,
      page,
      pageSize,
    });
    sendSuccess(res, result);
  }

  /**
   * GET /api/ai-tasks/:id
   * 获取任务详情
   */
  async getById(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const { id } = req.params;
    const task = await aiTaskService.getById(id, req.user.role, req.user.userId);
    sendSuccess(res, task);
  }

  /**
   * PATCH /api/ai-tasks/:id
   * 更新任务字段
   */
  async update(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const { id } = req.params;
    const data = updateAiTaskSchema.parse(req.body);
    const task = await aiTaskService.update(id, data, req.user.role, req.user.userId);
    sendSuccess(res, task);
  }

  /**
   * POST /api/ai-tasks/:id/execute
   * 触发 AI 异步执行
   */
  async execute(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const { id } = req.params;
    const { forceRerun } = req.body || {};
    const result = await aiTaskService.execute(id, req.user.role, req.user.userId, !!forceRerun);
    sendSuccess(res, result);
  }

  /**
   * PATCH /api/ai-tasks/:id/review
   * 老师审核（通过/驳回）
   */
  async review(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const { id } = req.params;
    const { action, feedback } = reviewAiTaskSchema.parse(req.body);
    const task = await aiTaskService.review(id, action, feedback, req.user.role, req.user.userId);
    sendSuccess(res, task);
  }

  /**
   * DELETE /api/ai-tasks/:id
   * 删除任务
   */
  async delete(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const { id } = req.params;
    const result = await aiTaskService.delete(id, req.user.role, req.user.userId);
    sendSuccess(res, result);
  }
}

export const aiTaskController = new AiTaskController();
