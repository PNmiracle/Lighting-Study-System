import { Router } from 'express';
import { supervisorController } from '../controllers/supervisor.controller';
import { authMiddleware } from '../middleware/auth';
import { roleMiddleware } from '../middleware/role';
import { Role } from '@prisma/client';

/**
 * 导师库路由
 */
export const supervisorRoutes = Router();

supervisorRoutes.use(authMiddleware);
supervisorRoutes.use(roleMiddleware([Role.ADMIN, Role.TEACHER]));

// GET / — 搜索导师库
supervisorRoutes.get('/', (req, res, next) => {
  supervisorController.search(req as any, res).catch(next);
});

// GET /:id — 获取导师详情
supervisorRoutes.get('/:id', (req, res, next) => {
  supervisorController.getById(req as any, res).catch(next);
});

// POST / — 创建导师
supervisorRoutes.post('/', (req, res, next) => {
  supervisorController.create(req as any, res).catch(next);
});

// PUT /:id — 更新导师
supervisorRoutes.put('/:id', (req, res, next) => {
  supervisorController.update(req as any, res).catch(next);
});

// DELETE /:id — 删除导师（仅管理员）
supervisorRoutes.delete('/:id', roleMiddleware([Role.ADMIN]), (req, res, next) => {
  supervisorController.delete(req as any, res).catch(next);
});
