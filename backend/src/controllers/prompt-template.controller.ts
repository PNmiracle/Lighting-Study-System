import { Response } from 'express';
import { AuthedRequest } from '../types';
import { promptTemplateService } from '../services/prompt-template.service';
import { createPromptTemplateSchema, updatePromptTemplateSchema } from '../utils/validation';
import { sendSuccess } from '../utils/response';
import { BusinessError } from '../middleware/error';
import { ErrorCode } from '../types';

/**
 * 提示词模板控制器
 */
export class PromptTemplateController {
  /**
   * GET /api/prompt-templates
   * 获取模板列表（支持分类过滤和搜索）
   */
  async list(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;

    const templates = await promptTemplateService.list({ category, search });
    sendSuccess(res, templates);
  }

  /**
   * POST /api/prompt-templates
   * 创建模板
   */
  async create(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const data = createPromptTemplateSchema.parse(req.body);
    const template = await promptTemplateService.create(data, req.user.userId);
    sendSuccess(res, template);
  }

  /**
   * PUT /api/prompt-templates/:id
   * 更新模板
   */
  async update(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const { id } = req.params;
    const data = updatePromptTemplateSchema.parse(req.body);
    const template = await promptTemplateService.update(id, data, req.user.userId, req.user.role);
    sendSuccess(res, template);
  }

  /**
   * DELETE /api/prompt-templates/:id
   * 删除模板
   */
  async delete(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const { id } = req.params;
    const result = await promptTemplateService.delete(id, req.user.userId, req.user.role);
    sendSuccess(res, result);
  }
}

export const promptTemplateController = new PromptTemplateController();
