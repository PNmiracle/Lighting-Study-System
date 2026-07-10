import { Response } from 'express';
import { AuthedRequest } from '../types';
import { authService } from '../services/auth.service';
import { loginSchema } from '../utils/validation';
import { sendSuccess } from '../utils/response';
import { BusinessError } from '../middleware/error';
import { ErrorCode } from '../types';

/**
 * 认证控制器
 */
export class AuthController {
  /**
   * POST /api/auth/login
   * 用户登录
   */
  async login(req: AuthedRequest, res: Response): Promise<void> {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);
    sendSuccess(res, result);
  }

  /**
   * GET /api/auth/me
   * 获取当前用户信息
   */
  async getMe(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);
    }
    const userInfo = await authService.getMe(req.user.userId);
    sendSuccess(res, userInfo);
  }
}

export const authController = new AuthController();
