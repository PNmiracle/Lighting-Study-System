import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

/**
 * 认证路由
 * POST /login — 公开
 * GET /me — 需认证
 */
export const authRoutes = Router();

authRoutes.post('/login', (req, res, next) => {
  authController.login(req, res).catch(next);
});

authRoutes.get('/me', authMiddleware, (req, res, next) => {
  authController.getMe(req as any, res).catch(next);
});
