import jwt from 'jsonwebtoken';
import { config } from '../config';
import { Role } from '@prisma/client';

/**
 * JWT Payload 接口
 */
export interface JwtPayload {
  userId: string;
  role: Role;
  name: string;
}

/**
 * 签发 JWT Token
 * @param payload - JWT 载荷（userId, role, name）
 * @returns 签发的 JWT token 字符串
 */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

/**
 * 验证 JWT Token
 * @param token - JWT token 字符串
 * @returns 解码后的 payload
 * @throws jwt.JsonWebTokenError - token 无效或过期
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
}
