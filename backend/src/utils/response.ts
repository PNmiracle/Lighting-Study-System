import { Response } from 'express';

/**
 * 统一 API 响应接口
 */
export interface ApiResponse<T = any> {
  code: number;
  data: T | null;
  message: string;
}

/**
 * 发送成功响应
 * @param res - Express Response 对象
 * @param data - 响应数据
 * @param message - 响应消息（默认 "success"）
 */
export function sendSuccess<T>(res: Response, data: T, message: string = 'success'): void {
  const response: ApiResponse<T> = {
    code: 0,
    data,
    message,
  };
  res.json(response);
}

/**
 * 发送错误响应
 * @param res - Express Response 对象
 * @param code - 错误码
 * @param message - 错误消息
 * @param statusCode - HTTP 状态码（默认 400）
 */
export function sendError(
  res: Response,
  code: number,
  message: string,
  statusCode: number = 400
): void {
  const response: ApiResponse = {
    code,
    data: null,
    message,
  };
  res.status(statusCode).json(response);
}
