import { Response, Request } from 'express';
import { AuthedRequest } from '../types';
import { userService } from '../services/user.service';
import { createUserSchema, updateUserSchema, updateUserStatusSchema } from '../utils/validation';
import { sendSuccess } from '../utils/response';
import { BusinessError } from '../middleware/error';
import { ErrorCode } from '../types';
import { Role } from '@prisma/client';

/**
 * 用户管理控制器
 */
export class UserController {
  /**
   * GET /api/users
   * 获取用户列表（分页 + 筛选）
   */
  async list(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const role = req.query.role as Role | undefined;
    const status = req.query.status as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const result = await userService.list({ role, status, page, pageSize });
    sendSuccess(res, result);
  }

  /**
   * POST /api/users
   * 创建用户（自动创建 Teacher/Student 关联）
   */
  async create(req: AuthedRequest, res: Response): Promise<void> {
    const data = createUserSchema.parse(req.body);
    const user = await userService.create(data);
    sendSuccess(res, user);
  }

  /**
   * PUT /api/users/:id
   * 更新用户信息
   */
  async update(req: AuthedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const data = updateUserSchema.parse(req.body);
    const user = await userService.update(id, data);
    sendSuccess(res, user);
  }

  /**
   * PATCH /api/users/:id/status
   * 更新用户状态（启用/禁用）
   */
  async updateStatus(req: AuthedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { status } = updateUserStatusSchema.parse(req.body);
    const user = await userService.updateStatus(id, status);
    sendSuccess(res, user);
  }
}

export const userController = new UserController();
