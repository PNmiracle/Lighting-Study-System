import { prisma } from '../config/prisma';
import { BusinessError } from '../middleware/error';
import { ErrorCode, TeacherWithCount, TeacherDetail, StudentSummary } from '../types';
import { Role, Prisma } from '@prisma/client';
import { studentService } from './student.service';

/**
 * 老师服务
 * 处理老师 CRUD + 学生数统计
 */
export class TeacherService {
  /**
   * 获取老师列表（含学生数统计）
   */
  async list(): Promise<TeacherWithCount[]> {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: true,
        students: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return teachers.map((t) => ({
      id: t.id,
      userId: t.userId,
      name: t.user.name,
      email: t.user.email,
      maxStudents: t.maxStudents,
      studentCount: t.students.length,
      status: t.user.status,
    }));
  }

  /**
   * 获取老师详情（含学生列表）
   */
  async getById(id: string): Promise<TeacherDetail> {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: true,
        students: {
          include: {
            user: true,
            assignments: {
              select: { id: true, studentIntent: true },
            },
          },
        },
      },
    });

    if (!teacher) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '老师不存在', 404);
    }

    const students: StudentSummary[] = teacher.students.map((s) => {
      const assignmentCount = s.assignments.length;
      const hasIntent = s.assignments.some((a) => a.studentIntent !== null);
      const feedbackStatus =
        assignmentCount === 0 ? 'SEARCHING' : hasIntent ? 'DONE' : 'PENDING';

      return {
        id: s.id,
        userId: s.userId,
        name: s.user.name,
        grade: s.grade,
        targetCountry: s.targetCountry,
        targetMajor: s.targetMajor,
        status: s.status,
        assignmentCount,
        feedbackStatus: feedbackStatus as any,
      };
    });

    return {
      id: teacher.id,
      userId: teacher.userId,
      name: teacher.user.name,
      email: teacher.user.email,
      maxStudents: teacher.maxStudents,
      studentCount: teacher.students.length,
      status: teacher.user.status,
      students,
    };
  }

  /**
   * 创建老师记录（已有 User）
   */
  async create(data: { userId: string; maxStudents?: number }) {
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '用户不存在', 404);
    }
    if (user.role !== Role.TEACHER) {
      throw new BusinessError(ErrorCode.VALIDATION_ERROR, '该用户不是老师角色', 422);
    }

    // 检查是否已有 Teacher 记录
    const existing = await prisma.teacher.findUnique({ where: { userId: data.userId } });
    if (existing) {
      throw new BusinessError(ErrorCode.VALIDATION_ERROR, '该用户已有老师记录', 422);
    }

    return prisma.teacher.create({
      data: {
        userId: data.userId,
        maxStudents: data.maxStudents ?? 20,
      },
    });
  }

  /**
   * 更新老师信息
   */
  async update(id: string, data: { maxStudents?: number }) {
    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '老师不存在', 404);
    }

    return prisma.teacher.update({
      where: { id },
      data: {
        maxStudents: data.maxStudents,
      },
    });
  }

  /**
   * 获取老师名下的学生列表
   */
  async getStudents(teacherId: string): Promise<StudentSummary[]> {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        students: {
          include: {
            user: true,
            assignments: {
              select: { id: true, studentIntent: true },
            },
          },
        },
      },
    });

    if (!teacher) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '老师不存在', 404);
    }

    return teacher.students.map((s) => {
      const assignmentCount = s.assignments.length;
      const hasIntent = s.assignments.some((a) => a.studentIntent !== null);
      const feedbackStatus =
        assignmentCount === 0 ? 'SEARCHING' : hasIntent ? 'DONE' : 'PENDING';

      return {
        id: s.id,
        userId: s.userId,
        name: s.user.name,
        grade: s.grade,
        targetCountry: s.targetCountry,
        targetMajor: s.targetMajor,
        status: s.status,
        assignmentCount,
        feedbackStatus: feedbackStatus as any,
      };
    });
  }
}

export const teacherService = new TeacherService();
