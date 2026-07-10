import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { teacherRoutes } from './teacher.routes';
import { studentRoutes } from './student.routes';
import { supervisorRoutes } from './supervisor.routes';
import { assignmentRoutes } from './assignment.routes';
import { statsRoutes } from './stats.routes';
import { aiTaskRoutes } from './ai-task.routes';
import { promptTemplateRoutes } from './prompt-template.routes';

/**
 * 路由聚合入口
 * 挂载所有业务模块路由
 */
export const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/teachers', teacherRoutes);
router.use('/students', studentRoutes);
router.use('/supervisors', supervisorRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/stats', statsRoutes);
router.use('/ai-tasks', aiTaskRoutes);
router.use('/prompt-templates', promptTemplateRoutes);
