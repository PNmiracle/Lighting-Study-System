import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teachersApi } from '../api/teachers';
import { toast } from 'sonner';

/**
 * 老师数据 Hooks
 */

/**
 * 获取老师列表
 */
export function useTeacherList() {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: () => teachersApi.list(),
  });
}

/**
 * 获取老师列表（别名，兼容使用方）
 */
export const useTeachers = useTeacherList;

/**
 * 获取老师详情
 */
export function useTeacherDetail(id: string | null) {
  return useQuery({
    queryKey: ['teacher', id],
    queryFn: () => teachersApi.get(id!),
    enabled: !!id,
  });
}

/**
 * 获取老师名下学生
 */
export function useTeacherStudents(id: string | null) {
  return useQuery({
    queryKey: ['teacher-students', id],
    queryFn: () => teachersApi.getStudents(id!),
    enabled: !!id,
  });
}

/**
 * 更新老师信息
 */
export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { maxStudents?: number } }) =>
      teachersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('老师信息更新成功');
    },
  });
}
