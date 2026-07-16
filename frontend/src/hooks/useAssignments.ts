import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentsApi } from '../api/assignments';
import type { CreateAssignmentInput } from '../types';
import { MatchLevel, StudentIntent } from '../types';
import { POLLING_INTERVAL } from '../utils/constants';
import { toast } from 'sonner';

/**
 * 推荐记录 Hooks
 * 包含 10s 轮询用于老师工作台实时反馈
 */

const QUERY_KEY = 'assignments';

/**
 * 获取推荐记录列表（老师视角，含 10s 轮询）
 */
export function useAssignments(studentId?: string, enablePolling: boolean = false) {
  return useQuery({
    queryKey: [QUERY_KEY, studentId],
    queryFn: () => assignmentsApi.list(studentId ? { studentId } : undefined),
    enabled: !!studentId,
    refetchInterval: enablePolling ? POLLING_INTERVAL : false,
  });
}

/**
 * 获取学生的推荐记录（学生视角）
 */
export function useStudentAssignments() {
  return useQuery({
    queryKey: [QUERY_KEY, 'student'],
    queryFn: () => assignmentsApi.list(),
  });
}

/**
 * 创建推荐记录
 */
export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssignmentInput) => assignmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('导师推荐已添加');
    },
  });
}

/**
 * 更新推荐记录
 */
export function useUpdateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { notes?: string; matchLevel?: MatchLevel | null };
    }) => assignmentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('推荐记录已更新');
    },
  });
}

/**
 * 删除推荐记录
 */
export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('推荐记录已删除');
    },
  });
}

/**
 * 学生标记意向
 */
export function useMarkIntent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, intent }: { id: string; intent: StudentIntent }) =>
      assignmentsApi.markIntent(id, intent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('意向已标记');
    },
    onError: (error: any) => {
      // 4008 意向已锁定
      if (error?.message?.includes('锁定')) {
        toast.error('该导师意向已锁定，请联系老师解锁');
      }
    },
  });
}

/**
 * 老师解锁意向
 */
export function useUnlockIntent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentsApi.unlock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('意向已解锁');
    },
  });
}
