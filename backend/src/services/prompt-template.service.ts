import { prisma } from '../config/prisma';
import { BusinessError } from '../middleware/error';
import { ErrorCode, PromptTemplateInfo } from '../types';
import { Role } from '@prisma/client';

/**
 * 提示词模板服务
 * 处理模板 CRUD + 占位符解析
 */
export class PromptTemplateService {
  /**
   * 格式化模板为 API 响应
   */
  private format(template: any): PromptTemplateInfo {
    return {
      id: template.id,
      name: template.name,
      content: template.content,
      category: template.category,
      createdBy: template.createdBy,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    };
  }

  /**
   * 获取模板列表（支持分类过滤和搜索）
   */
  async list(filters: { category?: string; search?: string }): Promise<PromptTemplateInfo[]> {
    const where: any = {};

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const templates = await prisma.promptTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return templates.map((t) => this.format(t));
  }

  /**
   * 创建模板
   */
  async create(
    data: { name: string; content: string; category?: string },
    userId: string
  ): Promise<PromptTemplateInfo> {
    const template = await prisma.promptTemplate.create({
      data: {
        name: data.name,
        content: data.content,
        category: data.category || null,
        createdBy: userId,
      },
    });

    return this.format(template);
  }

  /**
   * 更新模板（仅创建者可编辑）
   */
  async update(
    id: string,
    data: { name?: string; content?: string; category?: string | null },
    userId: string,
    role: Role
  ): Promise<PromptTemplateInfo> {
    const template = await prisma.promptTemplate.findUnique({ where: { id } });
    if (!template) {
      throw new BusinessError(ErrorCode.PROMPT_TEMPLATE_NOT_FOUND, '提示词模板不存在', 404);
    }

    // 仅创建者和管理员可编辑
    if (template.createdBy !== userId && role !== Role.ADMIN) {
      throw new BusinessError(ErrorCode.FORBIDDEN, '无权编辑此模板', 403);
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.category !== undefined) updateData.category = data.category;

    const updated = await prisma.promptTemplate.update({
      where: { id },
      data: updateData,
    });

    return this.format(updated);
  }

  /**
   * 删除模板（仅创建者可删除）
   */
  async delete(id: string, userId: string, role: Role): Promise<{ success: true }> {
    const template = await prisma.promptTemplate.findUnique({ where: { id } });
    if (!template) {
      throw new BusinessError(ErrorCode.PROMPT_TEMPLATE_NOT_FOUND, '提示词模板不存在', 404);
    }

    if (template.createdBy !== userId && role !== Role.ADMIN) {
      throw new BusinessError(ErrorCode.FORBIDDEN, '无权删除此模板', 403);
    }

    await prisma.promptTemplate.delete({ where: { id } });
    return { success: true };
  }

  /**
   * 解析模板占位符
   * {student_name} {target_country} {target_major} {grade}
   */
  resolveTemplate(
    templateContent: string,
    student: { name: string; targetCountry?: string | null; targetMajor?: string | null; grade?: string | null }
  ): string {
    return templateContent
      .replace(/\{student_name\}/g, student.name)
      .replace(/\{target_country\}/g, student.targetCountry || '未设置')
      .replace(/\{target_major\}/g, student.targetMajor || '未设置')
      .replace(/\{grade\}/g, student.grade || '未知')
      .replace(/\{vika_link\}/g, '（Vika 链接未配置）');
  }
}

export const promptTemplateService = new PromptTemplateService();
