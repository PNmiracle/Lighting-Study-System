import { Response } from 'express';
import { AuthedRequest } from '../types';
import { studentService } from '../services/student.service';
import { createStudentSchema, updateStudentSchema, assignStudentSchema } from '../utils/validation';
import { sendSuccess } from '../utils/response';
import { BusinessError } from '../middleware/error';
import { ErrorCode } from '../types';

/**
 * 学生控制器
 */
export class StudentController {
  /**
   * GET /api/students
   * 获取学生列表（按角色数据隔离）
   */
  async list(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const teacherId = req.query.teacherId as string | undefined;
    const students = await studentService.list(req.user.role, req.user.userId, teacherId);
    sendSuccess(res, students);
  }

  /**
   * GET /api/students/:id
   * 获取学生详情
   */
  async getById(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const { id } = req.params;
    const student = await studentService.getById(id, req.user.role, req.user.userId);
    sendSuccess(res, student);
  }

  /**
   * POST /api/students
   * 创建学生记录
   */
  async create(req: AuthedRequest, res: Response): Promise<void> {
    const data = createStudentSchema.parse(req.body);
    const student = await studentService.create(data);
    sendSuccess(res, student);
  }

  /**
   * PUT /api/students/:id
   * 更新学生信息
   */
  async update(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const { id } = req.params;
    const data = updateStudentSchema.parse(req.body);
    const student = await studentService.update(id, data, req.user.role, req.user.userId);
    sendSuccess(res, student);
  }

  /**
   * PATCH /api/students/:id/assign
   * 分配学生给老师
   */
  async assign(req: AuthedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { teacherId } = assignStudentSchema.parse(req.body);
    const student = await studentService.assign(teacherId, id);
    sendSuccess(res, student);
  }
}

export const studentController = new StudentController();
