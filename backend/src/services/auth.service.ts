import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { signToken } from '../utils/jwt';
import { BusinessError } from '../middleware/error';
import { ErrorCode, UserInfo, MATCH_LEVEL_LABELS, INTENT_LABELS } from '../types';
import { Role } from '@prisma/client';

/**
 * 认证服务
 * 处理密码校验、JWT 签发
 */
export class AuthService {
  /**
   * 用户登录
   * @param email - 用户邮箱
   * @param password - 明文密码
   * @returns 登录结果 { token, user }
   */
  async login(email: string, password: string): Promise<{ token: string; user: UserInfo }> {
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BusinessError(ErrorCode.PASSWORD_ERROR, '邮箱或密码错误', 401);
    }

    // 校验密码
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new BusinessError(ErrorCode.PASSWORD_ERROR, '邮箱或密码错误', 401);
    }

    // 检查账号状态
    if (user.status !== 'ACTIVE') {
      throw new BusinessError(ErrorCode.FORBIDDEN, '账号已被禁用，请联系管理员', 403);
    }

    // 签发 JWT
    const token = signToken({
      userId: user.id,
      role: user.role,
      name: user.name,
    });

    const userInfo: UserInfo = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    };

    return { token, user: userInfo };
  }

  /**
   * 获取当前用户信息
   * @param userId - 用户 ID
   * @returns 用户信息
   */
  async getMe(userId: string): Promise<UserInfo> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '用户不存在', 404);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    };
  }

  /**
   * 哈希密码
   * @param password - 明文密码
   * @returns 哈希后的密码
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}

export const authService = new AuthService();
