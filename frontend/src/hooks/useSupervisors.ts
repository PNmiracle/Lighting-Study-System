import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supervisorsApi } from '../api/supervisors';
import type { CreateSupervisorInput } from '../types';
import { toast } from 'sonner';

/**
 * 导师数据 Hooks
 */

/**
 * 搜索导师库
 */
export function useSupervisorSearch(params: {
  q?: string;
  university?: string;
  researchArea?: string;
  sortBy?: 'qs_ranking' | 'usnews_ranking' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ['supervisor-search', params],
    queryFn: () => supervisorsApi.search(params),
  });
}

/**
 * 获取导师详情
 */
export function useSupervisorDetail(id: string | null) {
  return useQuery({
    queryKey: ['supervisor-detail', id],
    queryFn: () => supervisorsApi.get(id!),
    enabled: !!id,
  });
}

/**
 * 创建导师
 */
export function useCreateSupervisor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSupervisorInput) => supervisorsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supervisor-search'] });
      toast.success('导师已创建');
    },
  });
}

/**
 * 更新导师
 */
export function useUpdateSupervisor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateSupervisorInput>;
    }) => supervisorsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supervisor-search'] });
      queryClient.invalidateQueries({ queryKey: ['supervisor-detail'] });
      toast.success('导师信息已更新');
    },
  });
}

/**
 * 删除导师
 */
export function useDeleteSupervisor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => supervisorsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supervisor-search'] });
      toast.success('导师已删除');
    },
  });
}
