import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config';
import { errorMiddleware } from './middleware/error';
import { router } from './routes';

/**
 * Express 应用配置
 */
const app = express();

// CORS 配置
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

// 请求解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP 请求日志
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({
    code: 0,
    data: { status: 'ok', timestamp: new Date().toISOString() },
    message: 'success',
  });
});

// API 路由
app.use('/api', router);

// 404 处理
app.use((_req, res) => {
  res.status(404).json({
    code: 404,
    data: null,
    message: '接口不存在',
  });
});

// 全局错误处理
app.use(errorMiddleware);

export { app };
