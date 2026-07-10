import { app } from './app';
import { config } from './config';
import { prisma } from './config/prisma';
import { aiExecutionService } from './services/ai-execution.service';

/**
 * 服务启动入口
 */
async function startServer(): Promise<void> {
  try {
    // 测试数据库连接
    await prisma.$connect();
    console.log('✅ 数据库连接成功');

    // 恢复超时的 AI 任务
    await aiExecutionService.recoverStaleTasks();

    // 启动 HTTP 服务
    const server = app.listen(config.port, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🚀 服务已启动: http://localhost:${config.port}`);
      console.log(`📝 环境: ${config.nodeEnv}`);
      console.log(`🏥 健康检查: http://localhost:${config.port}/api/health`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });

    // 优雅关闭
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} 信号收到，正在关闭服务...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('✅ 服务已安全关闭');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error('❌ 服务启动失败:', error);
    process.exit(1);
  }
}

startServer();
