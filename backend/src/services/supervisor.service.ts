import { prisma } from '../config/prisma';
import { BusinessError } from '../middleware/error';
import { ErrorCode, SupervisorInfo } from '../types';
import { Prisma } from '@prisma/client';

/**
 * 导师服务
 * 处理导师库 CRUD + 模糊搜索（ILIKE）+ 排序
 */
export class SupervisorService {
  /**
   * 将 Prisma Supervisor 转换为 API 响应格式
   */
  private formatSupervisor(s: any): SupervisorInfo {
    return {
      id: s.id,
      name: s.name,
      title: s.title,
      location: s.location,
      university: s.university,
      qsRanking: s.qsRanking,
      usnewsRanking: s.usnewsRanking,
      department: s.department,
      homepageUrl: s.homepageUrl,
      email: s.email,
      phdApplicationUrl: s.phdApplicationUrl,
      otherInfoUrl: s.otherInfoUrl,
      researchArea: s.researchArea,
      createdById: s.createdById,
      createdByName: s.createdBy?.name || '',
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    };
  }

  /**
   * 搜索导师库（支持模糊搜索 + 筛选 + 排序 + 分页）
   */
  async search(params: {
    q?: string;
    university?: string;
    researchArea?: string;
    sortBy?: 'qs_ranking' | 'usnews_ranking' | 'name';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }): Promise<{ items: SupervisorInfo[]; total: number }> {
    const {
      q,
      university,
      researchArea,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      pageSize = 20,
    } = params;

    const where: Prisma.SupervisorWhereInput = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { university: { contains: q, mode: 'insensitive' } },
        { researchArea: { contains: q, mode: 'insensitive' } },
        { department: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (university) {
      where.university = { contains: university, mode: 'insensitive' };
    }

    if (researchArea) {
      where.researchArea = { contains: researchArea, mode: 'insensitive' };
    }

    // 排序字段映射
    const orderBy: Prisma.SupervisorOrderByWithRelationInput = {};
    if (sortBy === 'qs_ranking') {
      orderBy.qsRanking = { sort: sortOrder, nulls: 'last' };
    } else if (sortBy === 'usnews_ranking') {
      orderBy.usnewsRanking = { sort: sortOrder, nulls: 'last' };
    } else {
      orderBy.name = sortOrder;
    }

    const [supervisors, total] = await Promise.all([
      prisma.supervisor.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          createdBy: { select: { name: true } },
        },
      }),
      prisma.supervisor.count({ where }),
    ]);

    return {
      items: supervisors.map((s) => this.formatSupervisor(s)),
      total,
    };
  }

  /**
   * 获取导师详情
   */
  async getById(id: string): Promise<SupervisorInfo> {
    const supervisor = await prisma.supervisor.findUnique({
      where: { id },
      include: {
        createdBy: { select: { name: true } },
      },
    });

    if (!supervisor) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '导师不存在', 404);
    }

    return this.formatSupervisor(supervisor);
  }

  /**
   * 创建导师
   */
  async create(data: {
    name: string;
    title?: string;
    location?: string;
    university?: string;
    qsRanking?: number;
    usnewsRanking?: number;
    department?: string;
    homepageUrl?: string;
    email?: string;
    phdApplicationUrl?: string;
    otherInfoUrl?: string;
    researchArea?: string;
  }, createdById: string): Promise<SupervisorInfo> {
    // 清理空字符串
    const cleanData: any = { ...data, createdById };
    Object.keys(cleanData).forEach((key) => {
      if (cleanData[key] === '') cleanData[key] = null;
    });

    const supervisor = await prisma.supervisor.create({
      data: cleanData,
      include: {
        createdBy: { select: { name: true } },
      },
    });

    return this.formatSupervisor(supervisor);
  }

  /**
   * 更新导师信息
   */
  async update(id: string, data: Partial<{
    name: string;
    title: string;
    location: string;
    university: string;
    qsRanking: number;
    usnewsRanking: number;
    department: string;
    homepageUrl: string;
    email: string;
    phdApplicationUrl: string;
    otherInfoUrl: string;
    researchArea: string;
  }>): Promise<SupervisorInfo> {
    const existing = await prisma.supervisor.findUnique({ where: { id } });
    if (!existing) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '导师不存在', 404);
    }

    // 清理空字符串
    const cleanData: any = { ...data };
    Object.keys(cleanData).forEach((key) => {
      if (cleanData[key] === '') cleanData[key] = null;
    });

    const supervisor = await prisma.supervisor.update({
      where: { id },
      data: cleanData,
      include: {
        createdBy: { select: { name: true } },
      },
    });

    return this.formatSupervisor(supervisor);
  }

  /**
   * 删除导师
   */
  async delete(id: string): Promise<{ success: true }> {
    const existing = await prisma.supervisor.findUnique({ where: { id } });
    if (!existing) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '导师不存在', 404);
    }

    await prisma.supervisor.delete({ where: { id } });
    return { success: true };
  }
}

export const supervisorService = new SupervisorService();
