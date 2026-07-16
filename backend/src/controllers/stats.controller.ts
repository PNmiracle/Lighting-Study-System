import { Response } from 'express';
import { AuthedRequest, StatsOverview } from '../types';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/response';
import { BusinessError } from '../middleware/error';
import { ErrorCode } from '../types';

/**
 * 统计控制器
 */
export class StatsController {
  /**
   * GET /api/stats/overview
   * 获取全局统计概览
   */
  async overview(req: AuthedRequest, res: Response): Promise<void> {
    if (!req.user) throw new BusinessError(ErrorCode.TOKEN_INVALID, '未认证', 401);

    const [totalStudents, totalTeachers, totalSupervisors, totalAssignments, studentsWithIntent] =
      await Promise.all([
        prisma.student.count(),
        prisma.teacher.count(),
        prisma.supervisor.count(),
        prisma.supervisorAssignment.count(),
        prisma.student.count({
          where: {
            assignments: {
              some: { studentIntent: { not: null } },
            },
          },
        }),
      ]);

    const avgAssignmentsPerStudent =
      totalStudents > 0 ? Math.round((totalAssignments / totalStudents) * 10) / 10 : 0;

    const feedbackRate =
      totalStudents > 0 ? Math.round((studentsWithIntent / totalStudents) * 1000) / 10 : 0;

    const stats: StatsOverview = {
      totalStudents,
      totalTeachers,
      totalSupervisors,
      totalAssignments,
      avgAssignmentsPerStudent,
      feedbackRate,
    };

    sendSuccess(res, stats);
  }
}

export const statsController = new StatsController();
