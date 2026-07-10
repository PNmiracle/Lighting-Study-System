import { Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { ErrorCode, Role, AuthedRequest } from '../types';

/**
 * 角色权限中间件工厂
 * 传入允许的角色列表，返回一个中间件检查 req.user.role 是否在允许列表中
 *
 * @param allowedRoles - 允许访问的角色列表
 * @returns Express 中间件
 */
export function roleMiddleware(allowedRoles: Role[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, ErrorCode.TOKEN_INVALID, '未认证用户', 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(res, ErrorCode.FORBIDDEN, '权限不足，无法访问此资源', 403);
      return;
    }

    next();
  };
}
