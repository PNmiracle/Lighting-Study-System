import { Router } from 'express';
import { teacherController } from '../controllers/teacher.controller';
import { authMiddleware } from '../middleware/auth';
import { roleMiddleware } from '../middleware/role';
import { Role } from '@prisma/client';

/**
 * 老师路由
 */
export const teacherRoutes = Router();

teacherRoutes.use(authMiddleware);
teacherRoutes.use(roleMiddleware([Role.ADMIN, Role.TEACHER]));

// GET / — 获取老师列表
teacherRoutes.get('/', (req, res, next) => {
  teacherController.list(req as any, res).catch(next);
});

// GET /:id — 获取老师详情
teacherRoutes.get('/:id', (req, res, next) => {
  teacherController.getById(req as any, res).catch(next);
});

// GET /:id/students — 获取老师名下学生
teacherRoutes.get('/:id/students', (req, res, next) => {
  teacherController.getStudents(req as any, res).catch(next);
});

// POST / — 创建老师（仅管理员）
teacherRoutes.post('/', roleMiddleware([Role.ADMIN]), (req, res, next) => {
  teacherController.create(req as any, res).catch(next);
});

// PUT /:id — 更新老师信息
teacherRoutes.put('/:id', (req, res, next) => {
  teacherController.update(req as any, res).catch(next);
});
