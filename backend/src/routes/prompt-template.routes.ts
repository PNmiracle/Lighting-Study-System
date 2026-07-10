import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { roleMiddleware } from '../middleware/role';
import { promptTemplateController } from '../controllers/prompt-template.controller';
import { Role } from '@prisma/client';

/**
 * 提示词模板路由
 * 权限：TEACHER + ADMIN（全局共享）
 */
const router = Router();

// 所有路由需要认证 + TEACHER/ADMIN 角色
router.use(authMiddleware);
router.use(roleMiddleware([Role.TEACHER, Role.ADMIN]));

// GET /api/prompt-templates — 模板列表
router.get('/', (req, res) => promptTemplateController.list(req, res));

// POST /api/prompt-templates — 创建模板
router.post('/', (req, res) => promptTemplateController.create(req, res));

// PUT /api/prompt-templates/:id — 更新模板
router.put('/:id', (req, res) => promptTemplateController.update(req, res));

// DELETE /api/prompt-templates/:id — 删除模板
router.delete('/:id', (req, res) => promptTemplateController.delete(req, res));

export const promptTemplateRoutes = router;
