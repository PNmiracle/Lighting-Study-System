import { prisma } from '../config/prisma';
import { BusinessError } from '../middleware/error';
import { ErrorCode, StudentSummary, StudentDetail } from '../types';
import { Role, Prisma } from '@prisma/client';

/**
 * 学生服务
 * 处理学生 CRUD + 师生分配逻辑 + feedbackStatus 计算
 */
export class StudentService {
  /**
   * 计算学生的反馈状态
   * SEARCHING: 无推荐记录
   * PENDING: 有推荐记录但无意向
   * DONE: 有推荐记录且至少一条有意向
   */
  computeFeedbackStatus(
    assignmentCount: number,
    hasIntent: boolean
  ): 'SEARCHING' | 'PENDING' | 'DONE' {
    if (assignmentCount === 0) return 'SEARCHING';
    if (hasIntent) return 'DONE';
    return 'PENDING';
  }

  /**
   * 获取学生列表
   * - Admin: 全部学生
   * - Teacher: 自己名下学生
   * - Student: 仅自己
   */
  async list(
    role: Role,
    userId: string,
    teacherId?: string
  ): Promise<StudentSummary[]> {
    let where: Prisma.StudentWhereInput = {};

    if (role === Role.TEACHER) {
      // 老师只能看自己名下学生
      const teacher = await prisma.teacher.findUnique({ where: { userId } });
      if (!teacher) return [];
      where.assignedTeacherId = teacher.id;
    } else if (role === Role.STUDENT) {
      // 学生只能看自己
      const student = await prisma.student.findUnique({ where: { userId } });
      if (!student) return [];
      where.id = student.id;
    } else if (teacherId) {
      // Admin 可以按 teacherId 筛选
      where.assignedTeacherId = teacherId;
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        user: true,
        assignments: {
          select: { id: true, studentIntent: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return students.map((s) => {
      const assignmentCount = s.assignments.length;
      const hasIntent = s.assignments.some((a) => a.studentIntent !== null);
      return {
        id: s.id,
        userId: s.userId,
        name: s.user.name,
        grade: s.grade,
        targetCountry: s.targetCountry,
        targetMajor: s.targetMajor,
        status: s.status,
        assignmentCount,
        feedbackStatus: this.computeFeedbackStatus(assignmentCount, hasIntent),
      };
    });
  }

  /**
   * 获取学生详情
   */
  async getById(id: string, role: Role, userId: string): Promise<StudentDetail> {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        assignedTeacher: {
          include: { user: true },
        },
        assignments: {
          select: { id: true, studentIntent: true },
        },
      },
    });

    if (!student) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '学生不存在', 404);
    }

    // 数据隔离检查
    if (role === Role.TEACHER) {
      const teacher = await prisma.teacher.findUnique({ where: { userId } });
      if (!teacher || student.assignedTeacherId !== teacher.id) {
        throw new BusinessError(ErrorCode.FORBIDDEN, '无权查看该学生信息', 403);
      }
    } else if (role === Role.STUDENT) {
      if (student.userId !== userId) {
        throw new BusinessError(ErrorCode.FORBIDDEN, '无权查看该学生信息', 403);
      }
    }

    const assignmentCount = student.assignments.length;
    const hasIntent = student.assignments.some((a) => a.studentIntent !== null);

    return {
      id: student.id,
      userId: student.userId,
      name: student.user.name,
      email: student.user.email,
      grade: student.grade,
      targetCountry: student.targetCountry,
      targetMajor: student.targetMajor,
      status: student.status,
      assignedTeacher: student.assignedTeacher
        ? { id: student.assignedTeacher.id, name: student.assignedTeacher.user.name }
        : null,
      assignmentCount,
      feedbackStatus: this.computeFeedbackStatus(assignmentCount, hasIntent),
    };
  }

  /**
   * 创建学生记录（已有 User）
   */
  async create(data: {
    userId: string;
    grade?: string;
    targetCountry?: string;
    targetMajor?: string;
  }) {
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '用户不存在', 404);
    }
    if (user.role !== Role.STUDENT) {
      throw new BusinessError(ErrorCode.VALIDATION_ERROR, '该用户不是学生角色', 422);
    }

    // 检查是否已有 Student 记录
    const existing = await prisma.student.findUnique({ where: { userId: data.userId } });
    if (existing) {
      throw new BusinessError(ErrorCode.VALIDATION_ERROR, '该用户已有学生记录', 422);
    }

    return prisma.student.create({
      data: {
        userId: data.userId,
        grade: data.grade,
        targetCountry: data.targetCountry,
        targetMajor: data.targetMajor,
        status: 'ACTIVE',
      },
    });
  }

  /**
   * 更新学生信息
   */
  async update(
    id: string,
    data: { grade?: string; targetCountry?: string; targetMajor?: string },
    role: Role,
    userId: string
  ) {
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '学生不存在', 404);
    }

    // 学生只能更新自己的信息
    if (role === Role.STUDENT && student.userId !== userId) {
      throw new BusinessError(ErrorCode.FORBIDDEN, '无权修改该学生信息', 403);
    }

    return prisma.student.update({
      where: { id },
      data: {
        grade: data.grade,
        targetCountry: data.targetCountry,
        targetMajor: data.targetMajor,
      },
    });
  }

  /**
   * 分配学生给老师
   */
  async assign(teacherId: string | null, studentId: string) {
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '学生不存在', 404);
    }

    if (teacherId === null) {
      // 取消分配
      return prisma.student.update({
        where: { id: studentId },
        data: { assignedTeacherId: null },
      });
    }

    // 检查老师是否存在
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        students: { select: { id: true } },
      },
    });
    if (!teacher) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '老师不存在', 404);
    }

    // 检查老师学生数是否已满
    if (teacher.students.length >= teacher.maxStudents && student.assignedTeacherId !== teacherId) {
      throw new BusinessError(ErrorCode.VALIDATION_ERROR, `老师学生数已达上限(${teacher.maxStudents})`, 422);
    }

    return prisma.student.update({
      where: { id: studentId },
      data: { assignedTeacherId: teacherId },
    });
  }
}

export const studentService = new StudentService();
