import { Router } from 'express';
import { assignmentController } from '../controllers/assignment.controller';
import { authMiddleware } from '../middleware/auth';
import { roleMiddleware } from '../middleware/role';
import { Role } from '@prisma/client';

/**
 * 推荐记录路由
 */
export const assignmentRoutes = Router();

assignmentRoutes.use(authMiddleware);

// GET / — 获取推荐记录列表（按角色数据隔离）
assignmentRoutes.get('/', (req, res, next) => {
  assignmentController.list(req as any, res).catch(next);
});

// POST / — 创建推荐记录（仅老师）
assignmentRoutes.post('/', roleMiddleware([Role.TEACHER]), (req, res, next) => {
  assignmentController.create(req as any, res).catch(next);
});

// PUT /:id — 更新推荐记录（仅老师）
assignmentRoutes.put('/:id', roleMiddleware([Role.TEACHER]), (req, res, next) => {
  assignmentController.update(req as any, res).catch(next);
});

// DELETE /:id — 删除推荐记录（仅老师）
assignmentRoutes.delete('/:id', roleMiddleware([Role.TEACHER]), (req, res, next) => {
  assignmentController.delete(req as any, res).catch(next);
});

// PATCH /:id/intent — 学生标记意向（仅学生）
assignmentRoutes.patch('/:id/intent', roleMiddleware([Role.STUDENT]), (req, res, next) => {
  assignmentController.markIntent(req as any, res).catch(next);
});

// PATCH /:id/unlock — 老师解锁意向（仅老师）
assignmentRoutes.patch('/:id/unlock', roleMiddleware([Role.TEACHER]), (req, res, next) => {
  assignmentController.unlock(req as any, res).catch(next);
});
