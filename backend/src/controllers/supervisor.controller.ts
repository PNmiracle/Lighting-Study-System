import { Response } from 'express';
import { AuthedRequest } from '../types';
import { supervisorService } from '../services/supervisor.service';
import { createSupervisorSchema, updateSupervisorSchema } from '../utils/validation';
import { sendSuccess } from '../utils/response';
import { BusinessError } from '../middleware/error';
import { ErrorCode } from '../types';

/**
 * 导师库控制器
 */
export class SupervisorController {
  /**
   * GET /api/supervisors
   * 搜索导师库（支持模糊搜索 + 筛选 + 排序 + 分页）
   */
  async search(req: AuthedRequest, res: Response): Promise<void> {
    const q = req.query.q as string | undefined;
    const university = req.query.university as string | undefined;
    const researchArea = req.query.researchArea as string | undefined;
    const sortBy = req.query.sortBy as 'qs_ranking' | 'usnews_ranking' | 'name' | undefined;
    const sortOrder = req.query.sortOrder as 'asc' | 'desc' | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const result = await supervisorService.search({
      q,
      university,
      researchArea,
      sortBy,
      sortOrder,
      page,
      pageSize,
    });
    sendSuccess(res, result);
  }

  /**
   * GET /api/supervisors/:id
   * 获取导师详情
   */
  async getById(req: AuthedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const supervisor = await supervisorService.getById(id);
    sendSuccess(res, supervisor);
  }

  /**
   * POST /api/supervisors
   * 创建导师
   */
  async create(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const data = createSupervisorSchema.parse(req.body);
    const supervisor = await supervisorService.create(data, req.user.userId);
    sendSuccess(res, supervisor);
  }

  /**
   * PUT /api/supervisors/:id
   * 更新导师信息
   */
  async update(req: AuthedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const data = updateSupervisorSchema.parse(req.body);
    const supervisor = await supervisorService.update(id, data);
    sendSuccess(res, supervisor);
  }

  /**
   * DELETE /api/supervisors/:id
   * 删除导师
   */
  async delete(req: AuthedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await supervisorService.delete(id);
    sendSuccess(res, result);
  }
}

export const supervisorController = new SupervisorController();
