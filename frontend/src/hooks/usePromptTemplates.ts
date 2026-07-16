import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promptTemplatesApi } from '../api/prompt-templates';
import type { CreatePromptTemplateInput, UpdatePromptTemplateInput } from '../types';
import { toast } from 'sonner';

/**
 * 提示词模板列表 hook
 */
export function usePromptTemplates(filters?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: ['prompt-templates', filters],
    queryFn: () => promptTemplatesApi.list(filters),
  });
}

/**
 * 创建模板 mutation
 */
export function useCreatePromptTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePromptTemplateInput) => promptTemplatesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompt-templates'] });
      toast.success('模板创建成功');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || '创建模板失败');
    },
  });
}

/**
 * 更新模板 mutation
 */
export function useUpdatePromptTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePromptTemplateInput }) =>
      promptTemplatesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompt-templates'] });
      toast.success('模板更新成功');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || '更新模板失败');
    },
  });
}

/**
 * 删除模板 mutation
 */
export function useDeletePromptTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => promptTemplatesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompt-templates'] });
      toast.success('模板已删除');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || '删除模板失败');
    },
  });
}
