import client from './client';
import type { Supervisor, CreateSupervisorInput } from '../types';

/**
 * 导师库 API
 */
export const supervisorsApi = {
  /**
   * 搜索导师库
   */
  search: (params: {
    q?: string;
    university?: string;
    researchArea?: string;
    sortBy?: 'qs_ranking' | 'usnews_ranking' | 'name';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }): Promise<{ items: Supervisor[]; total: number }> => {
    return client.get('/supervisors', { params });
  },

  /**
   * 获取导师详情
   */
  get: (id: string): Promise<Supervisor> => {
    return client.get(`/supervisors/${id}`);
  },

  /**
   * 创建导师
   */
  create: (data: CreateSupervisorInput): Promise<Supervisor> => {
    return client.post('/supervisors', data);
  },

  /**
   * 更新导师
   */
  update: (id: string, data: Partial<CreateSupervisorInput>): Promise<Supervisor> => {
    return client.put(`/supervisors/${id}`, data);
  },

  /**
   * 删除导师
   */
  delete: (id: string): Promise<{ success: boolean }> => {
    return client.delete(`/supervisors/${id}`);
  },
};
