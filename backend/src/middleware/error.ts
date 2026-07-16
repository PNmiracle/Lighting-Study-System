import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { ErrorCode } from '../types';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

/**
 * 业务错误类
 * 携带错误码、消息和 HTTP 状态码
 */
export class BusinessError extends Error {
  code: ErrorCode;
  statusCode: number;

  constructor(code: ErrorCode, message: string, statusCode: number = 400) {
    super(message);
    this.name = 'BusinessError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * 全局错误处理中间件
 * 捕获所有未处理的错误，统一格式化响应
 */
export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction): void {
  // BusinessError — 业务逻辑错误，携带错误码
  if (err instanceof BusinessError) {
    sendError(res, err.code, err.message, err.statusCode);
    return;
  }

  // ZodError — 参数校验失败
  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    sendError(res, ErrorCode.VALIDATION_ERROR, `参数校验失败: ${messages}`, 422);
    return;
  }

  // Prisma 唯一约束冲突
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ') || '字段';
      sendError(res, ErrorCode.EMAIL_EXISTS, `${target}已存在`, 409);
      return;
    }
    if (err.code === 'P2025') {
      sendError(res, ErrorCode.NOT_FOUND, '资源不存在', 404);
      return;
    }
  }

  // 其他未处理的错误 — 服务器内部错误
  console.error('❌ 未处理的错误:', err);
  sendError(res, ErrorCode.INTERNAL_ERROR, '服务器内部错误', 500);
}
