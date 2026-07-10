import { Router } from 'express';
import { studentController } from '../controllers/student.controller';
import { authMiddleware } from '../middleware/auth';
import { roleMiddleware } from '../middleware/role';
import { Role } from '@prisma/client';

/**
 * 学生路由
 */
export const studentRoutes = Router();

studentRoutes.use(authMiddleware);

// GET / — 获取学生列表（按角色数据隔离）
studentRoutes.get('/', (req, res, next) => {
  studentController.list(req as any, res).catch(next);
});

// GET /:id — 获取学生详情
studentRoutes.get('/:id', (req, res, next) => {
  studentController.getById(req as any, res).catch(next);
});

// POST / — 创建学生（仅管理员）
studentRoutes.post('/', roleMiddleware([Role.ADMIN]), (req, res, next) => {
  studentController.create(req as any, res).catch(next);
});

// PUT /:id — 更新学生信息
studentRoutes.put('/:id', (req, res, next) => {
  studentController.update(req as any, res).catch(next);
});

// PATCH /:id/assign — 分配学生给老师（仅管理员）
studentRoutes.patch('/:id/assign', roleMiddleware([Role.ADMIN]), (req, res, next) => {
  studentController.assign(req as any, res).catch(next);
});
