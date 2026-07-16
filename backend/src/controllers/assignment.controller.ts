import { Response } from 'express';
import { AuthedRequest } from '../types';
import { assignmentService } from '../services/assignment.service';
import { createAssignmentSchema, updateAssignmentSchema, markIntentSchema } from '../utils/validation';
import { sendSuccess } from '../utils/response';
import { BusinessError } from '../middleware/error';
import { ErrorCode } from '../types';
import { StudentIntent } from '@prisma/client';

/**
 * 推荐记录控制器
 */
export class AssignmentController {
  /**
   * GET /api/assignments
   * 获取推荐记录列表（按角色数据隔离）
   */
  async list(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const studentId = req.query.studentId as string | undefined;
    const teacherId = req.query.teacherId as string | undefined;
    const intent = req.query.intent as StudentIntent | undefined;

    const assignments = await assignmentService.list(req.user.role, req.user.userId, {
      studentId,
      teacherId,
      intent,
    });
    sendSuccess(res, assignments);
  }

  /**
   * POST /api/assignments
   * 创建推荐记录
   */
  async create(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const data = createAssignmentSchema.parse(req.body);
    const assignment = await assignmentService.create(data, req.user.role, req.user.userId);
    sendSuccess(res, assignment);
  }

  /**
   * PUT /api/assignments/:id
   * 更新推荐记录（老师编辑备注和匹配度）
   */
  async update(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const { id } = req.params;
    const data = updateAssignmentSchema.parse(req.body);
    const assignment = await assignmentService.update(id, data, req.user.role, req.user.userId);
    sendSuccess(res, assignment);
  }

  /**
   * DELETE /api/assignments/:id
   * 删除推荐记录
   */
  async delete(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const { id } = req.params;
    const result = await assignmentService.delete(id, req.user.role, req.user.userId);
    sendSuccess(res, result);
  }

  /**
   * PATCH /api/assignments/:id/intent
   * 学生标记意向
   */
  async markIntent(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const { id } = req.params;
    const { intent } = markIntentSchema.parse(req.body);
    const assignment = await assignmentService.markIntent(id, intent, req.user.role, req.user.userId);
    sendSuccess(res, assignment);
  }

  /**
   * PATCH /api/assignments/:id/unlock
   * 老师解锁意向
   */
  async unlock(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const { id } = req.params;
    const assignment = await assignmentService.unlock(id, req.user.role, req.user.userId);
    sendSuccess(res, assignment);
  }
}

export const assignmentController = new AssignmentController();
