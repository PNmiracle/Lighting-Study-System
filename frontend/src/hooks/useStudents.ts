import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../api/students';
import { toast } from 'sonner';

/**
 * 学生数据 Hooks
 */

/**
 * 获取学生列表
 */
export function useStudentList(teacherId?: string) {
  return useQuery({
    queryKey: ['students', teacherId],
    queryFn: () => studentsApi.list(teacherId ? { teacherId } : undefined),
  });
}

/**
 * 获取学生详情
 */
export function useStudentDetail(id: string | null) {
  return useQuery({
    queryKey: ['student-detail', id],
    queryFn: () => studentsApi.get(id!),
    enabled: !!id,
  });
}

/**
 * 更新学生信息
 */
export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { grade?: string; targetCountry?: string; targetMajor?: string };
    }) => studentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student-detail'] });
      toast.success('学生信息已更新');
    },
  });
}
