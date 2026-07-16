import { Request } from 'express';
import { Role, AiTaskStage, AiTaskRound, AiConfidence, AiTaskPriority } from '@prisma/client';

// 重新导出 Prisma 枚举，供 middleware/service 层使用
export { Role, AiTaskStage, AiTaskRound, AiConfidence, AiTaskPriority };

/**
 * 错误码枚举
 */
export enum ErrorCode {
  SUCCESS = 0,
  PASSWORD_ERROR = 4001, // 邮箱或密码错误
  TOKEN_INVALID = 4002, // Token 无效或过期
  FORBIDDEN = 4003, // 权限不足
  NOT_FOUND = 4004, // 资源不存在
  EMAIL_EXISTS = 4005, // 邮箱已存在
  VALIDATION_ERROR = 4006, // 参数校验失败
  ASSIGNMENT_EXISTS = 4007, // 推荐记录已存在（重复推荐）
  INTENT_LOCKED = 4008, // 意向已锁定
  STUDENT_ASSIGNED = 4009, // 学生已分配老师
  // AI 模块专用错误码
  AI_TASK_NOT_FOUND = 4010,        // AI 任务不存在
  AI_TASK_IN_EXECUTION = 4011,     // AI 任务正在执行中，不可重复触发
  AI_TASK_NOT_REVIEWABLE = 4012,   // AI 任务不在可审核状态
  AI_TASK_LOCKED = 4013,           // AI 任务已锁定（并发保护）
  AI_EXECUTION_TIMEOUT = 4014,     // AI 执行超时
  AI_EXECUTION_FAILED = 4015,      // AI 执行失败（已达最大重试次数）
  PROMPT_TEMPLATE_NOT_FOUND = 4016, // 提示词模板不存在
  INTERNAL_ERROR = 5000, // 服务器内部错误
}

/**
 * 认证后的请求对象扩展
 */
export interface AuthedRequest extends Request {
  user?: {
    userId: string;
    role: Role;
    name: string;
  };
}

/**
 * 用户信息（API 响应）
 */
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: string;
}

/**
 * 老师列表项（含学生数）
 */
export interface TeacherWithCount {
  id: string;
  userId: string;
  name: string;
  email: string;
  maxStudents: number;
  studentCount: number;
  status: string;
}

/**
 * 老师详情（含学生列表）
 */
export interface TeacherDetail {
  id: string;
  userId: string;
  name: string;
  email: string;
  maxStudents: number;
  studentCount: number;
  status: string;
  students: StudentSummary[];
}

/**
 * 学生摘要
 */
export interface StudentSummary {
  id: string;
  userId: string;
  name: string;
  grade: string | null;
  targetCountry: string | null;
  targetMajor: string | null;
  status: string;
  assignmentCount: number;
  feedbackStatus: 'SEARCHING' | 'PENDING' | 'DONE';
}

/**
 * 学生详情
 */
export interface StudentDetail {
  id: string;
  userId: string;
  name: string;
  email: string;
  grade: string | null;
  targetCountry: string | null;
  targetMajor: string | null;
  status: string;
  assignedTeacher: { id: string; name: string } | null;
  assignmentCount: number;
  feedbackStatus: 'SEARCHING' | 'PENDING' | 'DONE';
}

/**
 * 推荐记录详情
 */
export interface AssignmentDetail {
  id: string;
  studentId: string;
  studentName: string;
  supervisorId: string;
  supervisor: SupervisorInfo;
  teacherId: string;
  teacherName: string;
  notes: string | null;
  matchLevel: string | null;
  matchLevelLabel: string | null;
  studentIntent: string | null;
  intentLabel: string | null;
  intentLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 导师信息（API 响应）
 */
export interface SupervisorInfo {
  id: string;
  name: string;
  title: string | null;
  location: string | null;
  university: string | null;
  qsRanking: number | null;
  usnewsRanking: number | null;
  department: string | null;
  homepageUrl: string | null;
  email: string | null;
  phdApplicationUrl: string | null;
  otherInfoUrl: string | null;
  researchArea: string | null;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 统计概览
 */
export interface StatsOverview {
  totalStudents: number;
  totalTeachers: number;
  totalSupervisors: number;
  totalAssignments: number;
  avgAssignmentsPerStudent: number;
  feedbackRate: number;
}

// ==================== AI 模块类型 ====================

/**
 * AI 搜索结果中的单个导师条目
 */
export interface ResultSupervisorEntry {
  supervisorId: string;
  supervisorName: string;
  university: string | null;
  matchScore: number;    // 0-1 匹配度评分
  matchNotes: string;     // AI 匹配理由
}

/**
 * AI 任务摘要（列表项）
 */
export interface AiTaskSummary {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  prompt: string;           // 截断至前 100 字符
  stage: AiTaskStage;
  round: AiTaskRound;
  priority: AiTaskPriority;
  confidence: AiConfidence | null;
  errorCount: number;
  processingNode: string | null;
  lockedAt: string | null;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * AI 任务详情
 */
export interface AiTaskDetail extends AiTaskSummary {
  prompt: string;           // 完整 prompt
  aiFeedback: string | null;
  failureReason: string | null;
  resultSupervisorIds: ResultSupervisorEntry[] | null;
  vikaRecordId: string | null;
  student: {
    id: string;
    name: string;
    grade: string | null;
    targetCountry: string | null;
    targetMajor: string | null;
  };
  createdAssignments?: {
    id: string;
    supervisorId: string;
    supervisorName: string;
  }[];
}

/**
 * 创建 AI 任务输入
 */
export interface CreateAiTaskInput {
  studentId: string;
  prompt: string;
  round?: AiTaskRound;
  priority?: AiTaskPriority;
  vikaRecordId?: string;
}

/**
 * 更新 AI 任务输入
 */
export interface UpdateAiTaskInput {
  prompt?: string;
  priority?: AiTaskPriority;
  round?: AiTaskRound;
  stage?: 'NOT_STARTED' | 'PAUSED';
  failureReason?: string;
}

/**
 * 审核输入
 */
export interface ReviewInput {
  action: 'APPROVE' | 'REJECT';
  feedback?: string;
}

/**
 * 提示词模板
 */
export interface PromptTemplateInfo {
  id: string;
  name: string;
  content: string;
  category: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 匹配度标签映射
 */
export const MATCH_LEVEL_LABELS: Record<string, string> = {
  HIGH: '建议多看看',
  MEDIUM: '可以备选',
};

/**
 * 意向标签映射
 */
export const INTENT_LABELS: Record<string, string> = {
  WANT_CONTACT: '想联系',
  BACKUP: '备选',
  SKIP: '跳过',
};

/**
 * AI Stage 显示映射
 */
export const AI_STAGE_LABELS: Record<string, string> = {
  NOT_STARTED: '未开始',
  AI_PROCESSING: 'AI 执行中',
  AI_SELF_CHECK: 'AI 自检中',
  HUMAN_REVIEW: '待审核',
  COMPLETED: '已完成',
  PAUSED: '已暂停',
};

/**
 * AI Round 显示映射
 */
export const AI_ROUND_LABELS: Record<string, string> = {
  FIRST: '初选',
  SECOND: '第二轮',
  THIRD: '第三轮',
};

/**
 * AI Confidence 显示映射
 */
export const AI_CONFIDENCE_LABELS: Record<string, string> = {
  PASSED: '通过',
  FAILED: '未通过',
};

/**
 * AI Priority 显示映射
 */
export const AI_PRIORITY_LABELS: Record<string, string> = {
  P0: '最高',
  P1: '普通',
  P2: '较低',
};
