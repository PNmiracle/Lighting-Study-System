import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiTasksApi } from '../api/ai-tasks';
import type {
  AiTaskSummary,
  AiTaskDetail,
  CreateAiTaskInput,
  UpdateAiTaskInput,
  ReviewInput,
} from '../types';
import { AiTaskStage } from '../types';
import { AI_POLLING_ACTIVE, AI_POLLING_IDLE } from '../utils/constants';
import { toast } from 'sonner';

/**
 * AI 任务列表 hooks（含智能轮询）
 */
export function useAiTasks(filters?: {
  stage?: string;
  round?: string;
  priority?: string;
  studentId?: string;
}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['ai-tasks', filters],
    queryFn: () => aiTasksApi.list(filters),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data?.items) return AI_POLLING_IDLE;
      // 有 AI_PROCESSING 或 AI_SELF_CHECK 的任务 → 3s 轮询
      const hasActive = data.items.some(
        (t: AiTaskSummary) =>
          t.stage === AiTaskStage.AI_PROCESSING || t.stage === AiTaskStage.AI_SELF_CHECK
      );
      return hasActive ? AI_POLLING_ACTIVE : AI_POLLING_IDLE;
    },
  });

  return {
    tasks: query.data?.items || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * AI 任务详情 hook
 */
export function useAiTaskDetail(taskId: string | null) {
  return useQuery({
    queryKey: ['ai-tasks', taskId],
    queryFn: () => aiTasksApi.getById(taskId!),
    enabled: !!taskId,
    // 执行中的任务细节轮询更频繁
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      if (data.stage === AiTaskStage.AI_PROCESSING || data.stage === AiTaskStage.AI_SELF_CHECK) {
        return 2000; // 2s 轮询
      }
      return false;
    },
  });
}

/**
 * 创建 AI 任务 mutation
 */
export function useCreateAiTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAiTaskInput) => aiTasksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-tasks'] });
      toast.success('AI 选导任务创建成功');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || '创建失败');
    },
  });
}

/**
 * 更新 AI 任务 mutation
 */
export function useUpdateAiTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAiTaskInput }) =>
      aiTasksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-tasks'] });
      toast.success('任务更新成功');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || '更新失败');
    },
  });
}

/**
 * 执行 AI 任务 mutation
 */
export function useExecuteAiTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, forceRerun }: { id: string; forceRerun?: boolean }) =>
      aiTasksApi.execute(id, forceRerun),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ai-tasks'] });
      toast.success(`AI 任务已加入执行队列 (${data.taskId})`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || '执行失败');
    },
  });
}

/**
 * 审核 AI 任务 mutation
 */
export function useReviewAiTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReviewInput }) =>
      aiTasksApi.review(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-tasks'] });
      toast.success('审核完成');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || '审核失败');
    },
  });
}

/**
 * 删除 AI 任务 mutation
 */
export function useDeleteAiTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiTasksApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-tasks'] });
      toast.success('任务已删除');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || '删除失败');
    },
  });
}
