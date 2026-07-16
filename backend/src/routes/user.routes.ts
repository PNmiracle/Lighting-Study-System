import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth';
import { roleMiddleware } from '../middleware/role';
import { Role } from '@prisma/client';

/**
 * 用户管理路由（仅管理员）
 */
export const userRoutes = Router();

userRoutes.use(authMiddleware);
userRoutes.use(roleMiddleware([Role.ADMIN]));

userRoutes.get('/', (req, res, next) => {
  userController.list(req as any, res).catch(next);
});

userRoutes.post('/', (req, res, next) => {
  userController.create(req as any, res).catch(next);
});

userRoutes.put('/:id', (req, res, next) => {
  userController.update(req as any, res).catch(next);
});

userRoutes.patch('/:id/status', (req, res, next) => {
  userController.updateStatus(req as any, res).catch(next);
});
