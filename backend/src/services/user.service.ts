import { prisma } from '../config/prisma';
import { BusinessError } from '../middleware/error';
import { ErrorCode, UserInfo } from '../types';
import { Role, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

/**
 * 用户服务
 * 处理用户 CRUD，创建用户时自动创建 Teacher/Student 关联记录
 */
export class UserService {
  /**
   * 获取用户列表（分页 + 筛选）
   */
  async list(params: {
    role?: Role;
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: UserInfo[]; total: number }> {
    const { role, status, page = 1, pageSize = 20 } = params;

    const where: Prisma.UserWhereInput = {};
    if (role) where.role = role;
    if (status) where.status = status as any;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      items: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        status: u.status,
      })),
      total,
    };
  }

  /**
   * 创建用户（含自动创建 Teacher/Student 关联记录）
   * 使用事务确保数据一致性
   */
  async create(data: {
    email: string;
    password: string;
    name: string;
    role: Role;
  }): Promise<UserInfo> {
    const { email, password, name, role } = data;

    // 检查邮箱是否已存在
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new BusinessError(ErrorCode.EMAIL_EXISTS, '邮箱已存在', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // 使用事务创建用户 + 关联记录
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          role,
        },
      });

      // 根据角色自动创建 Teacher 或 Student 记录
      if (role === Role.TEACHER) {
        await tx.teacher.create({
          data: {
            userId: newUser.id,
            maxStudents: 20,
          },
        });
      } else if (role === Role.STUDENT) {
        await tx.student.create({
          data: {
            userId: newUser.id,
            status: 'ACTIVE',
          },
        });
      }

      return newUser;
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    };
  }

  /**
   * 更新用户信息
   */
  async update(
    id: string,
    data: { name?: string; email?: string; password?: string }
  ): Promise<UserInfo> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '用户不存在', 404);
    }

    // 如果更新邮箱，检查是否已存在
    if (data.email && data.email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email: data.email } });
      if (existing) {
        throw new BusinessError(ErrorCode.EMAIL_EXISTS, '邮箱已存在', 409);
      }
    }

    const updateData: Prisma.UserUpdateInput = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      status: updated.status,
    };
  }

  /**
   * 更新用户状态（启用/禁用）
   */
  async updateStatus(id: string, status: 'ACTIVE' | 'DISABLED'): Promise<UserInfo> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new BusinessError(ErrorCode.NOT_FOUND, '用户不存在', 404);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { status },
    });

    return {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      status: updated.status,
    };
  }

  /**
   * 根据 userId 获取 Teacher 记录
   */
  async getTeacherByUserId(userId: string) {
    return prisma.teacher.findUnique({ where: { userId } });
  }

  /**
   * 根据 userId 获取 Student 记录
   */
  async getStudentByUserId(userId: string) {
    return prisma.student.findUnique({ where: { userId } });
  }
}

export const userService = new UserService();
