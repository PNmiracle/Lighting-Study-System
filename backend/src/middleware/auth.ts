import { Response, NextFunction } from 'express';
import { config } from '../config';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import { ErrorCode, AuthedRequest } from '../types';

/**
 * JWT 认证中间件
 * 解析 Authorization 请求头中的 Bearer token，验证后将用户信息挂载到 req.user
 */
export function authMiddleware(req: AuthedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    sendError(res, ErrorCode.TOKEN_INVALID, '未提供认证令牌', 401);
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    sendError(res, ErrorCode.TOKEN_INVALID, '认证令牌格式错误', 401);
    return;
  }

  const token = parts[1];

  try {
    const payload = verifyToken(token);
    req.user = {
      userId: payload.userId,
      role: payload.role,
      name: payload.name,
    };
    next();
  } catch {
    sendError(res, ErrorCode.TOKEN_INVALID, '认证令牌无效或已过期', 401);
  }
}

export { config };
