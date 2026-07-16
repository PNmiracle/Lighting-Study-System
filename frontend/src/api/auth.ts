import client from './client';
import type { LoginResponse, User } from '../types';

/**
 * 认证 API
 */
export const authApi = {
  /**
   * 登录
   */
  login: (email: string, password: string): Promise<LoginResponse> => {
    return client.post('/auth/login', { email, password });
  },

  /**
   * 获取当前用户信息
   */
  getMe: (): Promise<User> => {
    return client.get('/auth/me');
  },
};
