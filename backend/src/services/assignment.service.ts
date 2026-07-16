import { prisma } from '../config/prisma';
import { BusinessError } from '../middleware/error';
import { ErrorCode, AssignmentDetail, MATCH_LEVEL_LABELS, INTENT_LABELS } from '../types';
import { Role, StudentIntent, MatchLevel, Prisma } from '@prisma/client';

/**
 * 推荐记录服务
 * 处理推荐记录 CRUD + 意向锁定/解锁逻辑 + 去重校验
 */
export class AssignmentService {
  /**
   * 格式化推荐记录为 API 响应
   */
  private formatAssignment(a: any): AssignmentDetail {
    return {
      id: a.id,
      studentId: a.studentId,
      studentName: a.student?.user?.name || '',
      supervisorId: a.supervisorId,
      supervisor: {
        id: a.supervisor.id,
        name: a.supervisor.name,
        title: a.supervisor.title,
        location: a.supervisor.location,
        university: a.supervisor.university,
        qsRanking: a.supervisor.qsRanking,
        usnewsRanking: a.supervisor.usnewsRanking,
        department: a.supervisor.department,
        homepageUrl: a.supervisor.homepageUrl,
        email: a.supervisor.email,
        phdApplicationUrl: a.supervisor.phdApplicationUrl,
        otherInfoUrl: a.supervisor.otherInfoUrl,
        researchArea: a.supervisor.researchArea,
        createdById: a.supervisor.createdById,
        createdByName: a.supervisor.createdBy?.name || '',
        createdAt: a.supervisor.createdAt.toISOString(),
        updatedAt: a.supervisor.updatedAt.toISOString(),
      },
      teacherId: a.teacherId,
      teacherName: a.teacher?.user?.name || '',
      notes: a.notes,
      matchLevel: a.matchLevel,
      matchLevelLabel: a.matchLevel ? MATCH_LEVEL_LABELS[a.matchLevel] || null : null,
      studentIntent: a.studentIntent,
      intentLabel: a.studentIntent ? INTENT_LABELS[a.studentIntent] || null : null,
      intentLocked: a.intentLocked,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    };
  }

  /**
   * 获取推荐记录列表
   * - Admin: 全部
   * - Teacher: 自己创建的
   * - Student: 自己的
   */
  async list(
    role: Role,
    userId: string,
    filters: { studentId?: string; teacherId?: string; intent?: StudentIntent }
  ): Promise<AssignmentDetail[]> {
    const where: Prisma.SupervisorAssignmentWhereInput = {};

    if (role === Role.TEACHER) {
      const teacher = await prisma.teacher.findUnique({ where: { userId } });
      if (!teacher) return [];
      where.teacherId = teacher.id;
    } else if (role === Role.STUDENT) {
      const student = await prisma.student.findUnique({ where: { userId } });
      if (!student) return [];
      where.studentId = student.id;
    }

    // 可选筛选
    if (filters.studentId) where.studentId = filters.studentId;
    if (filters.teacherId) where.teacherId = filters.teacherId;
    if (filters.intent) where.studentIntent = filters.intent;

    const assignments = await prisma.supervisorAssignment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { include: { user: true } },
        supervisor: {
          include: {
            createdBy: { select: { name: true } },
          },
        },
        teacher: { include: { user: true } },
      },
    });

    return assignments.map((a) => this.formatAssignment(a));
  }

  /**
   * 创建推荐记录
   */
  async create(
    data: {
      studentId: string;
      supervisorId: string;
      notes?: string;
      matchLevel?: MatchLevel | null;
    },
    role: Role,
    userId: string
  ): Promise<AssignmentDetail> {
    if (role !== Role.TEACHER) {
      throw new BusinessError(ErrorCode.FORBIDDEN, '只有老师可以创建推荐记录', 403);
    }

    // 获取老师的 Teacher 记录
    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    if (!teacher) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '老师记录不存在', 404);
    }

    // 校验学生是否分配给该老师
    const student = await prisma.student.findUnique({
      where: { id: data.studentId },
    });
    if (!student) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '学生不存在', 404);
    }
    if (student.assignedTeacherId !== teacher.id) {
      throw new BusinessError(ErrorCode.FORBIDDEN, '该学生未分配给您，无法创建推荐记录', 403);
    }

    // 校验导师是否存在
    const supervisor = await prisma.supervisor.findUnique({
      where: { id: data.supervisorId },
    });
    if (!supervisor) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '导师不存在', 404);
    }

    // 检查是否已存在推荐记录（去重）
    const existing = await prisma.supervisorAssignment.findUnique({
      where: {
        studentId_supervisorId: {
          studentId: data.studentId,
          supervisorId: data.supervisorId,
        },
      },
    });
    if (existing) {
      throw new BusinessError(ErrorCode.ASSIGNMENT_EXISTS, '该导师已推荐给此学生，请勿重复推荐', 409);
    }

    const assignment = await prisma.supervisorAssignment.create({
      data: {
        studentId: data.studentId,
        supervisorId: data.supervisorId,
        teacherId: teacher.id,
        notes: data.notes || null,
        matchLevel: data.matchLevel || null,
      },
      include: {
        student: { include: { user: true } },
        supervisor: {
          include: {
            createdBy: { select: { name: true } },
          },
        },
        teacher: { include: { user: true } },
      },
    });

    return this.formatAssignment(assignment);
  }

  /**
   * 更新推荐记录（老师编辑备注和匹配度）
   */
  async update(
    id: string,
    data: { notes?: string; matchLevel?: MatchLevel | null },
    role: Role,
    userId: string
  ): Promise<AssignmentDetail> {
    if (role !== Role.TEACHER) {
      throw new BusinessError(ErrorCode.FORBIDDEN, '只有老师可以编辑推荐记录', 403);
    }

    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    if (!teacher) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '老师记录不存在', 404);
    }

    const assignment = await prisma.supervisorAssignment.findUnique({
      where: { id },
    });
    if (!assignment) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '推荐记录不存在', 404);
    }

    // 校验是否是该老师创建的推荐记录
    if (assignment.teacherId !== teacher.id) {
      throw new BusinessError(ErrorCode.FORBIDDEN, '无权编辑此推荐记录', 403);
    }

    const updateData: Prisma.SupervisorAssignmentUpdateInput = {};
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.matchLevel !== undefined) updateData.matchLevel = data.matchLevel;

    const updated = await prisma.supervisorAssignment.update({
      where: { id },
      data: updateData,
      include: {
        student: { include: { user: true } },
        supervisor: {
          include: {
            createdBy: { select: { name: true } },
          },
        },
        teacher: { include: { user: true } },
      },
    });

    return this.formatAssignment(updated);
  }

  /**
   * 删除推荐记录
   */
  async delete(id: string, role: Role, userId: string): Promise<{ success: true }> {
    if (role !== Role.TEACHER) {
      throw new BusinessError(ErrorCode.FORBIDDEN, '只有老师可以删除推荐记录', 403);
    }

    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    if (!teacher) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '老师记录不存在', 404);
    }

    const assignment = await prisma.supervisorAssignment.findUnique({
      where: { id },
    });
    if (!assignment) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '推荐记录不存在', 404);
    }

    if (assignment.teacherId !== teacher.id) {
      throw new BusinessError(ErrorCode.FORBIDDEN, '无权删除此推荐记录', 403);
    }

    await prisma.supervisorAssignment.delete({ where: { id } });
    return { success: true };
  }

  /**
   * 学生标记意向
   * WANT_CONTACT/BACKUP → intentLocked = true
   * SKIP → intentLocked = false（可改）
   */
  async markIntent(
    id: string,
    intent: StudentIntent,
    role: Role,
    userId: string
  ): Promise<AssignmentDetail> {
    if (role !== Role.STUDENT) {
      throw new BusinessError(ErrorCode.FORBIDDEN, '只有学生可以标记意向', 403);
    }

    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '学生记录不存在', 404);
    }

    const assignment = await prisma.supervisorAssignment.findUnique({
      where: { id },
    });
    if (!assignment) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '推荐记录不存在', 404);
    }

    // 校验是否是该学生的推荐记录
    if (assignment.studentId !== student.id) {
      throw new BusinessError(ErrorCode.FORBIDDEN, '无权标记此推荐记录', 403);
    }

    // 检查是否已锁定
    if (assignment.intentLocked) {
      throw new BusinessError(ErrorCode.INTENT_LOCKED, '意向已锁定，请联系老师解锁', 409);
    }

    // WANT_CONTACT/BACKUP → 锁定；SKIP → 不锁定
    const intentLocked = intent === StudentIntent.WANT_CONTACT || intent === StudentIntent.BACKUP;

    const updated = await prisma.supervisorAssignment.update({
      where: { id },
      data: {
        studentIntent: intent,
        intentLocked,
      },
      include: {
        student: { include: { user: true } },
        supervisor: {
          include: {
            createdBy: { select: { name: true } },
          },
        },
        teacher: { include: { user: true } },
      },
    });

    return this.formatAssignment(updated);
  }

  /**
   * 老师解锁意向
   * 重置 studentIntent = null, intentLocked = false
   */
  async unlock(id: string, role: Role, userId: string): Promise<AssignmentDetail> {
    if (role !== Role.TEACHER) {
      throw new BusinessError(ErrorCode.FORBIDDEN, '只有老师可以解锁意向', 403);
    }

    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    if (!teacher) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '老师记录不存在', 404);
    }

    const assignment = await prisma.supervisorAssignment.findUnique({
      where: { id },
    });
    if (!assignment) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '推荐记录不存在', 404);
    }

    if (assignment.teacherId !== teacher.id) {
      throw new BusinessError(ErrorCode.FORBIDDEN, '无权解锁此推荐记录', 403);
    }

    const updated = await prisma.supervisorAssignment.update({
      where: { id },
      data: {
        studentIntent: null,
        intentLocked: false,
      },
      include: {
        student: { include: { user: true } },
        supervisor: {
          include: {
            createdBy: { select: { name: true } },
          },
        },
        teacher: { include: { user: true } },
      },
    });

    return this.formatAssignment(updated);
  }
}

export const assignmentService = new AssignmentService();
