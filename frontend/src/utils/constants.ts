import { Role, MatchLevel, StudentIntent, FeedbackStatus, UserStatus, AiTaskStage, AiTaskRound, AiConfidence, AiTaskPriority } from '../types';

/**
 * 角色标签映射
 */
export const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMIN]: '管理员',
  [Role.TEACHER]: '选导老师',
  [Role.STUDENT]: '学生',
};

/**
 * 角色首页路径
 */
export const ROLE_HOME_PATH: Record<Role, string> = {
  [Role.ADMIN]: '/admin',
  [Role.TEACHER]: '/teacher',
  [Role.STUDENT]: '/student',
};

/**
 * 匹配度标签映射
 */
export const MATCH_LEVEL_LABELS: Record<MatchLevel, string> = {
  [MatchLevel.HIGH]: '建议多看看',
  [MatchLevel.MEDIUM]: '可以备选',
};

/**
 * 匹配度颜色映射（MUI 色值）
 */
export const MATCH_LEVEL_COLORS: Record<MatchLevel, string> = {
  [MatchLevel.HIGH]: '#2e7d32', // 绿色
  [MatchLevel.MEDIUM]: '#ed6c02', // 黄色
};

/**
 * 匹配度背景色映射
 */
export const MATCH_LEVEL_BG_COLORS: Record<MatchLevel, string> = {
  [MatchLevel.HIGH]: '#e8f5e9',
  [MatchLevel.MEDIUM]: '#fff3e0',
};

/**
 * 意向标签映射
 */
export const INTENT_LABELS: Record<StudentIntent, string> = {
  [StudentIntent.WANT_CONTACT]: '想联系',
  [StudentIntent.BACKUP]: '备选',
  [StudentIntent.SKIP]: '跳过',
};

/**
 * 意向颜色映射
 */
export const INTENT_COLORS: Record<StudentIntent, string> = {
  [StudentIntent.WANT_CONTACT]: '#2e7d32', // 绿色
  [StudentIntent.BACKUP]: '#ed6c02', // 黄色
  [StudentIntent.SKIP]: '#9e9e9e', // 灰色
};

/**
 * 意向背景色映射
 */
export const INTENT_BG_COLORS: Record<StudentIntent, string> = {
  [StudentIntent.WANT_CONTACT]: '#e8f5e9',
  [StudentIntent.BACKUP]: '#fff3e0',
  [StudentIntent.SKIP]: '#f5f5f5',
};

/**
 * 反馈状态标签
 */
export const FEEDBACK_STATUS_LABELS: Record<FeedbackStatus, string> = {
  SEARCHING: '搜索中',
  PENDING: '待反馈',
  DONE: '已反馈',
};

/**
 * 反馈状态颜色
 */
export const FEEDBACK_STATUS_COLORS: Record<FeedbackStatus, 'default' | 'warning' | 'success' | 'info'> = {
  SEARCHING: 'info',
  PENDING: 'warning',
  DONE: 'success',
};

/**
 * 用户状态标签
 */
export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: '正常',
  [UserStatus.DISABLED]: '已禁用',
};

/**
 * 学生状态标签
 */
export const STUDENT_STATUS_LABELS: Record<string, string> = {
  ACTIVE: '在读',
  GRADUATED: '已毕业',
  PAUSED: '暂停',
};

// ==================== AI 模块常量映射 ====================

/**
 * AI Stage 显示映射
 */
export const AI_STAGE_LABELS: Record<AiTaskStage, string> = {
  [AiTaskStage.NOT_STARTED]: '未开始',
  [AiTaskStage.AI_PROCESSING]: 'AI 执行中',
  [AiTaskStage.AI_SELF_CHECK]: 'AI 自检中',
  [AiTaskStage.HUMAN_REVIEW]: '待审核',
  [AiTaskStage.COMPLETED]: '已完成',
  [AiTaskStage.PAUSED]: '已暂停',
};

/**
 * AI Stage 颜色映射
 */
export const AI_STAGE_COLORS: Record<AiTaskStage, string> = {
  [AiTaskStage.NOT_STARTED]: '#9e9e9e',
  [AiTaskStage.AI_PROCESSING]: '#1976d2',
  [AiTaskStage.AI_SELF_CHECK]: '#ed6c02',
  [AiTaskStage.HUMAN_REVIEW]: '#f9a825',
  [AiTaskStage.COMPLETED]: '#2e7d32',
  [AiTaskStage.PAUSED]: '#d32f2f',
};

/**
 * 看板列顺序（从左到右）
 */
export const STAGE_COLUMN_ORDER: AiTaskStage[] = [
  AiTaskStage.NOT_STARTED,
  AiTaskStage.AI_PROCESSING,
  AiTaskStage.AI_SELF_CHECK,
  AiTaskStage.HUMAN_REVIEW,
  AiTaskStage.COMPLETED,
  AiTaskStage.PAUSED,
];

/**
 * AI Round 显示映射
 */
export const AI_ROUND_LABELS: Record<AiTaskRound, string> = {
  [AiTaskRound.FIRST]: '初选',
  [AiTaskRound.SECOND]: '第二轮',
  [AiTaskRound.THIRD]: '第三轮',
};

/**
 * AI Confidence 显示映射
 */
export const AI_CONFIDENCE_LABELS: Record<AiConfidence, string> = {
  [AiConfidence.PASSED]: '通过',
  [AiConfidence.FAILED]: '未通过',
};

/**
 * AI Confidence 颜色映射
 */
export const AI_CONFIDENCE_COLORS: Record<AiConfidence, string> = {
  [AiConfidence.PASSED]: '#2e7d32',
  [AiConfidence.FAILED]: '#d32f2f',
};

/**
 * AI Priority 显示映射
 */
export const AI_PRIORITY_LABELS: Record<AiTaskPriority, string> = {
  [AiTaskPriority.P0]: '最高',
  [AiTaskPriority.P1]: '普通',
  [AiTaskPriority.P2]: '较低',
};

/**
 * AI Priority 颜色映射（卡片边框色）
 */
export const AI_PRIORITY_COLORS: Record<AiTaskPriority, string> = {
  [AiTaskPriority.P0]: '#d32f2f',
  [AiTaskPriority.P1]: '#1976d2',
  [AiTaskPriority.P2]: '#9e9e9e',
};

/**
 * AI Priority MUI chip color
 */
export const AI_PRIORITY_CHIP_COLORS: Record<AiTaskPriority, 'error' | 'primary' | 'default'> = {
  [AiTaskPriority.P0]: 'error',
  [AiTaskPriority.P1]: 'primary',
  [AiTaskPriority.P2]: 'default',
};

/**
 * 处理节点显示映射
 */
export const PROCESSING_NODE_LABELS: Record<string, string> = {
  searching_supervisors: '正在搜索匹配导师',
  filling_supervisor_info: '正在整理导师详细信息',
  verifying_links: '正在验证导师主页/邮箱链接',
  self_checking: '正在进行置信度自检',
  done: '执行完成（等待审核）',
};

/**
 * 轮询间隔（毫秒）
 */
export const POLLING_INTERVAL = 10_000;

/**
 * AI 任务轮询间隔（毫秒）
 */
export const AI_POLLING_ACTIVE = 3_000;   // 有执行中任务时 3s
export const AI_POLLING_IDLE = 30_000;     // 无执行中任务时 30s

/**
 * 本地存储键
 */
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;
