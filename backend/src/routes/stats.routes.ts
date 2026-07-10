import { Router } from 'express';
import { statsController } from '../controllers/stats.controller';
import { authMiddleware } from '../middleware/auth';
import { roleMiddleware } from '../middleware/role';
import { Role } from '@prisma/client';

/**
 * 统计路由（仅管理员）
 */
export const statsRoutes = Router();

statsRoutes.use(authMiddleware);
statsRoutes.use(roleMiddleware([Role.ADMIN]));

statsRoutes.get('/overview', (req, res, next) => {
  statsController.overview(req as any, res).catch(next);
});
