import client from './client';
import type { TeacherWithCount, TeacherDetail } from '../types';

/**
 * 老师 API
 */
export const teachersApi = {
  /**
   * 获取老师列表
   */
  list: (): Promise<TeacherWithCount[]> => {
    return client.get('/teachers');
  },

  /**
   * 获取老师详情
   */
  get: (id: string): Promise<TeacherDetail> => {
    return client.get(`/teachers/${id}`);
  },

  /**
   * 获取老师名下的学生列表
   */
  getStudents: (id: string) => {
    return client.get(`/teachers/${id}/students`);
  },

  /**
   * 更新老师信息
   */
  update: (id: string, data: { maxStudents?: number }) => {
    return client.put(`/teachers/${id}`, data);
  },
};
