/**
 * 前端共享类型定义
 */

export enum Role {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  GRADUATED = 'GRADUATED',
  PAUSED = 'PAUSED',
}

export enum MatchLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
}

export enum StudentIntent {
  WANT_CONTACT = 'WANT_CONTACT',
  BACKUP = 'BACKUP',
  SKIP = 'SKIP',
}

// ==================== AI 模块枚举 ====================

export enum AiTaskStage {
  NOT_STARTED = 'NOT_STARTED',
  AI_PROCESSING = 'AI_PROCESSING',
  AI_SELF_CHECK = 'AI_SELF_CHECK',
  HUMAN_REVIEW = 'HUMAN_REVIEW',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
}

export enum AiTaskRound {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD',
}

export enum AiConfidence {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
}

export enum AiTaskPriority {
  P0 = 'P0',
  P1 = 'P1',
  P2 = 'P2',
}

export type FeedbackStatus = 'SEARCHING' | 'PENDING' | 'DONE';

/**
 * 统一 API 响应格式
 */
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

/**
 * 分页响应格式
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

/**
 * 用户信息
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: UserStatus;
}

/**
 * 登录响应
 */
export interface LoginResponse {
  token: string;
  user: User;
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
  status: UserStatus;
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
  status: UserStatus;
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
  status: StudentStatus;
  assignmentCount: number;
  feedbackStatus: FeedbackStatus;
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
  status: StudentStatus;
  assignedTeacher: { id: string; name: string } | null;
  assignmentCount: number;
  feedbackStatus: FeedbackStatus;
}

/**
 * 导师信息
 */
export interface Supervisor {
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
 * 推荐记录详情
 */
export interface AssignmentDetail {
  id: string;
  studentId: string;
  studentName: string;
  supervisorId: string;
  supervisor: Supervisor;
  teacherId: string;
  teacherName: string;
  notes: string | null;
  matchLevel: MatchLevel | null;
  matchLevelLabel: string | null;
  studentIntent: StudentIntent | null;
  intentLabel: string | null;
  intentLocked: boolean;
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

/**
 * 创建用户输入
 */
export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role: Role;
}

/**
 * 创建导师输入
 */
export interface CreateSupervisorInput {
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
}

/**
 * 创建推荐记录输入
 */
export interface CreateAssignmentInput {
  studentId: string;
  supervisorId: string;
  notes?: string;
  matchLevel?: MatchLevel | null;
}

// ==================== AI 模块前端类型 ====================

/**
 * AI 搜索结果中的单个导师条目
 */
export interface ResultSupervisorEntry {
  supervisorId: string;
  supervisorName: string;
  university: string | null;
  matchScore: number;
  matchNotes: string;
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
  prompt: string;
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
  prompt: string;
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
export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  category: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建提示词模板输入
 */
export interface CreatePromptTemplateInput {
  name: string;
  content: string;
  category?: string;
}

/**
 * 更新提示词模板输入
 */
export interface UpdatePromptTemplateInput {
  name?: string;
  content?: string;
  category?: string | null;
}
