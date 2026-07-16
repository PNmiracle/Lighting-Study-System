import { Response } from 'express';
import { AuthedRequest } from '../types';
import { teacherService } from '../services/teacher.service';
import { createTeacherSchema, updateTeacherSchema } from '../utils/validation';
import { sendSuccess } from '../utils/response';
import { BusinessError } from '../middleware/error';
import { ErrorCode } from '../types';

/**
 * 老师控制器
 */
export class TeacherController {
  /**
   * GET /api/teachers
   * 获取老师列表
   */
  async list(req: AuthedRequest, res: Response): Promise<void> {
    const teachers = await teacherService.list();
    sendSuccess(res, teachers);
  }

  /**
   * GET /api/teachers/:id
   * 获取老师详情
   */
  async getById(req: AuthedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const teacher = await teacherService.getById(id);
    sendSuccess(res, teacher);
  }

  /**
   * POST /api/teachers
   * 创建老师记录
   */
  async create(req: AuthedRequest, res: Response): Promise<void> {
    const data = createTeacherSchema.parse(req.body);
    const teacher = await teacherService.create(data);
    sendSuccess(res, teacher);
  }

  /**
   * PUT /api/teachers/:id
   * 更新老师信息
   */
  async update(req: AuthedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const data = updateTeacherSchema.parse(req.body);
    const teacher = await teacherService.update(id, data);
    sendSuccess(res, teacher);
  }

  /**
   * GET /api/teachers/:id/students
   * 获取老师名下的学生列表
   */
  async getStudents(req: AuthedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const students = await teacherService.getStudents(id);
    sendSuccess(res, students);
  }
}

export const teacherController = new TeacherController();
