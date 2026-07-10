import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';
import { Close, PlayArrow, Refresh, DoneAll } from '@mui/icons-material';
import { AiTaskStage, AiTaskDetail } from '../../../types';
import {
  AI_STAGE_LABELS,
  AI_STAGE_COLORS,
  AI_ROUND_LABELS,
  AI_PRIORITY_LABELS,
  AI_PRIORITY_CHIP_COLORS,
  AI_CONFIDENCE_LABELS,
  AI_CONFIDENCE_COLORS,
  PROCESSING_NODE_LABELS,
} from '../../../utils/constants';
import { useAiTaskDetail } from '../../../hooks/useAiTasks';
import ExecutionProgress from './ExecutionProgress';

interface TaskDetailDrawerProps {
  taskId: string | null;
  onClose: () => void;
  onReview: (taskId: string) => void;
}

export default function TaskDetailDrawer({ taskId, onClose, onReview }: TaskDetailDrawerProps) {
  const { data: task, isLoading, isError } = useAiTaskDetail(taskId);

  const isProcessing = task?.stage === AiTaskStage.AI_PROCESSING || task?.stage === AiTaskStage.AI_SELF_CHECK;
  const isReviewable = task?.stage === AiTaskStage.HUMAN_REVIEW;

  return (
    <Drawer anchor="right" open={!!taskId} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 480 } } }}>
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* 标题栏 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            任务详情
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : isError || !task ? (
          <Typography color="error">加载失败</Typography>
        ) : (
          <>
            {/* 基本信息 */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                基本信息
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                <InfoItem label="学生" value={task.student?.name || task.studentName} />
                <InfoItem label="年级" value={task.student?.grade || '-'} />
                <InfoItem label="目标地区" value={task.student?.targetCountry || '-'} />
                <InfoItem label="目标专业" value={task.student?.targetMajor || '-'} />
                <InfoItem label="轮次" value={AI_ROUND_LABELS[task.round]} />
                <InfoItem label="优先级" value={AI_PRIORITY_LABELS[task.priority]} />
                <InfoItem
                  label="状态"
                  value={
                    <Chip
                      label={AI_STAGE_LABELS[task.stage]}
                      size="small"
                      sx={{ bgcolor: AI_STAGE_COLORS[task.stage], color: '#fff', fontSize: '0.7rem' }}
                    />
                  }
                />
                <InfoItem label="错误次数" value={String(task.errorCount)} />
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* AI 执行进度 */}
            {isProcessing && (
              <Box sx={{ mb: 2 }}>
                <ExecutionProgress processingNode={task.processingNode} aiFeedback={task.aiFeedback} />
              </Box>
            )}

            {/* 置信度 */}
            {task.confidence && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                  置信度评估
                </Typography>
                <Chip
                  label={AI_CONFIDENCE_LABELS[task.confidence]}
                  size="small"
                  sx={{
                    bgcolor: AI_CONFIDENCE_COLORS[task.confidence],
                    color: '#fff',
                    fontWeight: 600,
                  }}
                />
              </Box>
            )}

            {/* 完整 Prompt */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                提示词
              </Typography>
              <Box
                sx={{
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  p: 1.5,
                  maxHeight: 200,
                  overflowY: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {task.prompt}
              </Box>
            </Box>

            {/* AI 反馈日志 */}
            {task.aiFeedback && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                  AI 反馈日志
                </Typography>
                <Box
                  sx={{
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                    p: 1.5,
                    maxHeight: 150,
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '0.72rem',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {task.aiFeedback}
                </Box>
              </Box>
            )}

            {/* 失败原因 */}
            {task.failureReason && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'error.main' }}>
                  失败原因
                </Typography>
                <Typography variant="body2" color="error.main">
                  {task.failureReason}
                </Typography>
              </Box>
            )}

            {/* 已创建的 Assignment */}
            {task.createdAssignments && task.createdAssignments.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                  已生成推荐记录 ({task.createdAssignments.length})
                </Typography>
                {task.createdAssignments.map((a) => (
                  <Chip key={a.id} label={a.supervisorName} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
              </Box>
            )}

            {/* 时间信息 */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                时间信息
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                <InfoItem label="创建时间" value={new Date(task.createdAt).toLocaleString()} />
                <InfoItem label="更新时间" value={new Date(task.updatedAt).toLocaleString()} />
                {task.startedAt && <InfoItem label="开始时间" value={new Date(task.startedAt).toLocaleString()} />}
                {task.endedAt && <InfoItem label="结束时间" value={new Date(task.endedAt).toLocaleString()} />}
              </Box>
            </Box>

            <Box sx={{ flex: 1 }} />

            {/* 操作按钮 */}
            <Box sx={{ display: 'flex', gap: 1, pt: 2, borderTop: '1px solid #e0e0e0' }}>
              {isReviewable && (
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<DoneAll />}
                  onClick={() => onReview(task.id)}
                  fullWidth
                >
                  去审核
                </Button>
              )}
              {task.stage === AiTaskStage.NOT_STARTED || task.stage === AiTaskStage.PAUSED ? (
                <Button variant="contained" startIcon={<PlayArrow />} fullWidth onClick={() => onClose()}>
                  关闭
                </Button>
              ) : (
                <Button variant="outlined" fullWidth onClick={onClose}>
                  关闭
                </Button>
              )}
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}

/** 信息项辅助组件 */
function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem', display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
        {value}
      </Typography>
    </Box>
  );
}
