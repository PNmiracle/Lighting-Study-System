import dotenv from 'dotenv';

dotenv.config();

/**
 * 应用配置
 * 从环境变量读取配置项，提供默认值和类型安全
 */
export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/study_abroad_mgmt?schema=public',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // ==================== AI 模块配置 ====================
  /** AI 执行超时时间（毫秒），默认 30 分钟 */
  aiExecutionTimeoutMs: parseInt(process.env.AI_EXECUTION_TIMEOUT_MS || '1800000', 10),
  /** AI 最大并发执行数 */
  aiMaxConcurrent: parseInt(process.env.AI_MAX_CONCURRENT || '3', 10),
  /** Vika 同步开关 */
  vikaSyncEnabled: process.env.VIKA_SYNC_ENABLED === 'true',
  /** Vika API 基础 URL */
  vikaApiBase: process.env.VIKA_API_BASE || '',
  /** Vika API 访问令牌 */
  vikaApiToken: process.env.VIKA_API_TOKEN || '',
  /** AI Skill API 基础 URL（phd-supervisor-selector） */
  aiSkillApiBase: process.env.AI_SKILL_API_BASE || 'http://localhost:8080',
  /** AI Skill API 密钥 */
  aiSkillApiKey: process.env.AI_SKILL_API_KEY || '',
} as const;

export type AppConfig = typeof config;
