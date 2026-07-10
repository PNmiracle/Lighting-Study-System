import client from './client';
import type { User, Role } from '../types';

/**
 * 用户管理 API
 */
export const usersApi = {
  /**
   * 获取用户列表
   */
  list: (params: { role?: Role; page?: number; pageSize?: number }) => {
    return client.get('/users', { params });
  },

  /**
   * 创建用户
   */
  create: (data: { email: string; password: string; name: string; role: Role }) => {
    return client.post('/users', data);
  },

  /**
   * 更新用户
   */
  update: (id: string, data: { name?: string; email?: string; password?: string }) => {
    return client.put(`/users/${id}`, data);
  },

  /**
   * 更新用户状态
   */
  toggleStatus: (id: string, status: 'ACTIVE' | 'DISABLED') => {
    return client.patch(`/users/${id}/status`, { status });
  },
};
