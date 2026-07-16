import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { roleMiddleware } from '../middleware/role';
import { aiTaskController } from '../controllers/ai-task.controller';
import { Role } from '@prisma/client';

/**
 * AI 选导任务路由
 * 权限：TEACHER + ADMIN
 */
const router = Router();

// 所有路由需要认证 + TEACHER/ADMIN 角色
router.use(authMiddleware);
router.use(roleMiddleware([Role.TEACHER, Role.ADMIN]));

// POST /api/ai-tasks — 创建 AI 选导任务
router.post('/', (req, res) => aiTaskController.create(req, res));

// GET /api/ai-tasks — 任务列表（支持多维度筛选）
router.get('/', (req, res) => aiTaskController.list(req, res));

// GET /api/ai-tasks/:id — 任务详情
router.get('/:id', (req, res) => aiTaskController.getById(req, res));

// PATCH /api/ai-tasks/:id — 更新任务字段
router.patch('/:id', (req, res) => aiTaskController.update(req, res));

// POST /api/ai-tasks/:id/execute — 触发 AI 异步执行
router.post('/:id/execute', (req, res) => aiTaskController.execute(req, res));

// PATCH /api/ai-tasks/:id/review — 老师审核（通过/驳回）
router.patch('/:id/review', (req, res) => aiTaskController.review(req, res));

// DELETE /api/ai-tasks/:id — 删除任务
router.delete('/:id', (req, res) => aiTaskController.delete(req, res));

export const aiTaskRoutes = router;
