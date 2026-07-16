import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users';
import { teachersApi } from '../api/teachers';
import { studentsApi } from '../api/students';
import { Role } from '../types';
import { toast } from 'sonner';

/**
 * 用户管理 Hooks
 */

/**
 * 获取老师列表
 */
export function useTeachers() {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: () => teachersApi.list(),
  });
}

/**
 * 获取学生列表（管理员）
 */
export function useStudents(teacherId?: string) {
  return useQuery({
    queryKey: ['students', teacherId],
    queryFn: () => studentsApi.list(teacherId ? { teacherId } : undefined),
  });
}

/**
 * 获取用户列表
 */
export function useUsers(role?: Role) {
  return useQuery({
    queryKey: ['users', role],
    queryFn: () => usersApi.list({ role, pageSize: 100 }),
  });
}

/**
 * 创建用户
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; password: string; name: string; role: Role }) =>
      usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('用户创建成功');
    },
  });
}

/**
 * 更新用户状态（启用/禁用）
 */
export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'DISABLED' }) =>
      usersApi.toggleStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('状态更新成功');
    },
  });
}

/**
 * 分配学生给老师
 */
export function useAssignStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentId, teacherId }: { studentId: string; teacherId: string | null }) =>
      studentsApi.assign(studentId, teacherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('分配成功');
    },
  });
}
