import client from './client';
import type { AssignmentDetail, CreateAssignmentInput } from '../types';
import { MatchLevel, StudentIntent } from '../types';

/**
 * 推荐记录 API
 */
export const assignmentsApi = {
  /**
   * 获取推荐记录列表
   */
  list: (params?: {
    studentId?: string;
    teacherId?: string;
    intent?: StudentIntent;
  }): Promise<AssignmentDetail[]> => {
    return client.get('/assignments', { params });
  },

  /**
   * 创建推荐记录
   */
  create: (data: CreateAssignmentInput): Promise<AssignmentDetail> => {
    return client.post('/assignments', data);
  },

  /**
   * 更新推荐记录（备注 + 匹配度）
   */
  update: (
    id: string,
    data: { notes?: string; matchLevel?: MatchLevel | null }
  ): Promise<AssignmentDetail> => {
    return client.put(`/assignments/${id}`, data);
  },

  /**
   * 删除推荐记录
   */
  delete: (id: string): Promise<{ success: boolean }> => {
    return client.delete(`/assignments/${id}`);
  },

  /**
   * 学生标记意向
   */
  markIntent: (id: string, intent: StudentIntent): Promise<AssignmentDetail> => {
    return client.patch(`/assignments/${id}/intent`, { intent });
  },

  /**
   * 老师解锁意向
   */
  unlock: (id: string): Promise<AssignmentDetail> => {
    return client.patch(`/assignments/${id}/unlock`);
  },
};
