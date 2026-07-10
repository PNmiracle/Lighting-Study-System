import { z } from 'zod';
import { Role, UserStatus, MatchLevel, StudentIntent, AiTaskStage, AiTaskRound, AiTaskPriority, AiConfidence } from '@prisma/client';

/**
 * Zod Schema 定义
 * 用于请求参数校验
 */

// ==================== 枚举校验 ====================
export const roleSchema = z.nativeEnum(Role);
export const userStatusSchema = z.nativeEnum(UserStatus);
export const matchLevelSchema = z.nativeEnum(MatchLevel).nullable().optional();
export const studentIntentSchema = z.nativeEnum(StudentIntent);

// ==================== 认证 ====================
export const loginSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(1, '密码不能为空'),
});

// ==================== 用户管理 ====================
export const createUserSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(8, '密码至少8位'),
  name: z.string().min(1, '姓名不能为空'),
  role: roleSchema,
});

export const updateUserSchema = z.object({
  name: z.string().min(1, '姓名不能为空').optional(),
  email: z.string().email('邮箱格式不正确').optional(),
  password: z.string().min(8, '密码至少8位').optional(),
});

export const updateUserStatusSchema = z.object({
  status: userStatusSchema,
});

// ==================== 老师管理 ====================
export const createTeacherSchema = z.object({
  userId: z.string().uuid('用户ID格式不正确'),
  maxStudents: z.number().int().min(1).max(100).optional(),
});

export const updateTeacherSchema = z.object({
  maxStudents: z.number().int().min(1).max(100).optional(),
});

// ==================== 学生管理 ====================
export const createStudentSchema = z.object({
  userId: z.string().uuid('用户ID格式不正确'),
  grade: z.string().optional(),
  targetCountry: z.string().optional(),
  targetMajor: z.string().optional(),
});

export const updateStudentSchema = z.object({
  grade: z.string().optional(),
  targetCountry: z.string().optional(),
  targetMajor: z.string().optional(),
});

export const assignStudentSchema = z.object({
  teacherId: z.string().uuid('老师ID格式不正确').nullable(),
});

// ==================== 导师库 ====================
export const createSupervisorSchema = z.object({
  name: z.string().min(1, '导师姓名不能为空'),
  title: z.string().optional(),
  location: z.string().optional(),
  university: z.string().optional(),
  qsRanking: z.number().int().min(1).optional(),
  usnewsRanking: z.number().int().min(1).optional(),
  department: z.string().optional(),
  homepageUrl: z.string().url('主页URL格式不正确').optional().or(z.literal('')),
  email: z.string().email('邮箱格式不正确').optional().or(z.literal('')),
  phdApplicationUrl: z.string().url('申请URL格式不正确').optional().or(z.literal('')),
  otherInfoUrl: z.string().url('其他信息URL格式不正确').optional().or(z.literal('')),
  researchArea: z.string().optional(),
});

export const updateSupervisorSchema = createSupervisorSchema.partial();

// ==================== 推荐记录 ====================
export const createAssignmentSchema = z.object({
  studentId: z.string().uuid('学生ID格式不正确'),
  supervisorId: z.string().uuid('导师ID格式不正确'),
  notes: z.string().optional(),
  matchLevel: matchLevelSchema,
});

export const updateAssignmentSchema = z.object({
  notes: z.string().optional(),
  matchLevel: matchLevelSchema,
});

export const markIntentSchema = z.object({
  intent: studentIntentSchema,
});

// ==================== AI 任务校验 ====================
export const aiTaskStageSchema = z.nativeEnum(AiTaskStage);
export const aiTaskRoundSchema = z.nativeEnum(AiTaskRound);
export const aiConfidenceSchema = z.nativeEnum(AiConfidence);
export const aiTaskPrioritySchema = z.nativeEnum(AiTaskPriority);

export const createAiTaskSchema = z.object({
  studentId: z.string().uuid('学生ID格式不正确'),
  prompt: z.string().min(1, '提示词不能为空'),
  round: aiTaskRoundSchema.optional(),
  priority: aiTaskPrioritySchema.optional(),
  vikaRecordId: z.string().optional(),
});

export const updateAiTaskSchema = z.object({
  prompt: z.string().min(1, '提示词不能为空').optional(),
  priority: aiTaskPrioritySchema.optional(),
  round: aiTaskRoundSchema.optional(),
  stage: z.enum(['NOT_STARTED', 'PAUSED']).optional(),
  failureReason: z.string().optional(),
});

export const reviewAiTaskSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
  feedback: z.string().optional(),
});

// ==================== 提示词模板校验 ====================
export const createPromptTemplateSchema = z.object({
  name: z.string().min(1, '模板名称不能为空'),
  content: z.string().min(1, '模板内容不能为空'),
  category: z.string().optional(),
});

export const updatePromptTemplateSchema = z.object({
  name: z.string().min(1, '模板名称不能为空').optional(),
  content: z.string().min(1, '模板内容不能为空').optional(),
  category: z.string().optional().nullable(),
});
