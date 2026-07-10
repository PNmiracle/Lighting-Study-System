import client from './client';
import type { StudentSummary, StudentDetail } from '../types';

/**
 * 学生 API
 */
export const studentsApi = {
  /**
   * 获取学生列表
   */
  list: (params?: { teacherId?: string }): Promise<StudentSummary[]> => {
    return client.get('/students', { params });
  },

  /**
   * 获取学生详情
   */
  get: (id: string): Promise<StudentDetail> => {
    return client.get(`/students/${id}`);
  },

  /**
   * 更新学生信息
   */
  update: (
    id: string,
    data: { grade?: string; targetCountry?: string; targetMajor?: string }
  ) => {
    return client.put(`/students/${id}`, data);
  },

  /**
   * 分配学生给老师
   */
  assign: (id: string, teacherId: string | null) => {
    return client.patch(`/students/${id}/assign`, { teacherId });
  },
};
