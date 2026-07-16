import client from './client';
import type {
  PromptTemplate,
  CreatePromptTemplateInput,
  UpdatePromptTemplateInput,
} from '../types';

/**
 * 提示词模板 API 请求层
 */
export const promptTemplatesApi = {
  /** GET /api/prompt-templates — 模板列表 */
  list: (params?: { category?: string; search?: string }): Promise<PromptTemplate[]> => {
    return client.get('/prompt-templates', { params });
  },

  /** POST /api/prompt-templates — 创建模板 */
  create: (data: CreatePromptTemplateInput): Promise<PromptTemplate> => {
    return client.post('/prompt-templates', data);
  },

  /** PUT /api/prompt-templates/:id — 更新模板 */
  update: (id: string, data: UpdatePromptTemplateInput): Promise<PromptTemplate> => {
    return client.put(`/prompt-templates/${id}`, data);
  },

  /** DELETE /api/prompt-templates/:id — 删除模板 */
  remove: (id: string): Promise<{ success: true }> => {
    return client.delete(`/prompt-templates/${id}`);
  },
};
