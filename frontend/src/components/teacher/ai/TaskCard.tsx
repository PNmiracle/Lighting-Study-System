import { Card, CardContent, Typography, Chip, Box, LinearProgress, IconButton, Tooltip } from '@mui/material';
import {
  PlayArrow,
  Refresh,
  DoneAll,
  RemoveRedEye,
  Error as ErrorIcon,
  PauseCircle,
} from '@mui/icons-material';
import { AiTaskSummary, AiTaskStage, AiConfidence } from '../../../types';
import {
  AI_STAGE_LABELS,
  AI_ROUND_LABELS,
  AI_PRIORITY_LABELS,
  AI_PRIORITY_COLORS,
  AI_PRIORITY_CHIP_COLORS,
  AI_CONFIDENCE_LABELS,
  AI_CONFIDENCE_COLORS,
  PROCESSING_NODE_LABELS,
} from '../../../utils/constants';

interface TaskCardProps {
  task: AiTaskSummary;
  onExecute: (taskId: string) => void;
  onView: (taskId: string) => void;
  onReview: (taskId: string) => void;
}

export default function TaskCard({ task, onExecute, onView, onReview }: TaskCardProps) {
  const borderColor = AI_PRIORITY_COLORS[task.priority];
  const isProcessing = task.stage === AiTaskStage.AI_PROCESSING || task.stage === AiTaskStage.AI_SELF_CHECK;
  const hasError = task.errorCount > 0;

  const nodeLabel = task.processingNode ? PROCESSING_NODE_LABELS[task.processingNode] || task.processingNode : null;

  /** 根据不同 stage 渲染操作按钮 */
  const renderActions = () => {
    const buttons: JSX.Element[] = [];

    switch (task.stage) {
      case AiTaskStage.NOT_STARTED:
      case AiTaskStage.PAUSED:
        buttons.push(
          <Tooltip key="exec" title={task.stage === AiTaskStage.PAUSED ? '重试' : '执行'}>
            <IconButton size="small" color="primary" onClick={() => onExecute(task.id)}>
              {task.stage === AiTaskStage.PAUSED ? <Refresh fontSize="small" /> : <PlayArrow fontSize="small" />}
            </IconButton>
          </Tooltip>
        );
        break;
      case AiTaskStage.HUMAN_REVIEW:
        buttons.push(
          <Tooltip key="review" title="审核">
            <IconButton size="small" color="warning" onClick={() => onReview(task.id)}>
              <DoneAll fontSize="small" />
            </IconButton>
          </Tooltip>
        );
        break;
      case AiTaskStage.COMPLETED:
        buttons.push(
          <Tooltip key="view" title="查看详情">
            <IconButton size="small" color="success" onClick={() => onView(task.id)}>
              <RemoveRedEye fontSize="small" />
            </IconButton>
          </Tooltip>
        );
        break;
      default:
        // AI_PROCESSING / AI_SELF_CHECK — 查看详情
        buttons.push(
          <Tooltip key="view" title="查看详情">
            <IconButton size="small" onClick={() => onView(task.id)}>
              <RemoveRedEye fontSize="small" />
            </IconButton>
          </Tooltip>
        );
    }

    return buttons;
  };

  return (
    <Card
      sx={{
        mb: 1.5,
        borderLeft: `3px solid ${borderColor}`,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 3 },
      }}
      onClick={() => onView(task.id)}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        {/* 第一行：学生姓名 + 轮次 + 优先级 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
            {task.studentName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Chip label={AI_ROUND_LABELS[task.round]} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
            <Chip
              label={AI_PRIORITY_LABELS[task.priority]}
              size="small"
              color={AI_PRIORITY_CHIP_COLORS[task.priority]}
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          </Box>
        </Box>

        {/* 第二行：进度/状态 */}
        {isProcessing && (
          <Box sx={{ mb: 0.5 }}>
            <LinearProgress
              variant="indeterminate"
              sx={{ height: 4, borderRadius: 2, mb: 0.25 }}
            />
            {nodeLabel && (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                {nodeLabel}
              </Typography>
            )}
          </Box>
        )}

        {/* 置信度标签 */}
        {task.confidence && (
          <Chip
            label={AI_CONFIDENCE_LABELS[task.confidence]}
            size="small"
            sx={{
              fontSize: '0.65rem',
              height: 18,
              mb: 0.5,
              bgcolor: AI_CONFIDENCE_COLORS[task.confidence],
              color: '#fff',
            }}
          />
        )}

        {/* 第三行：时间 + 错误 + 操作 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
              {task.startedAt
                ? new Date(task.startedAt).toLocaleDateString()
                : new Date(task.createdAt).toLocaleDateString()}
            </Typography>
            {hasError && (
              <Chip
                icon={<ErrorIcon sx={{ fontSize: 12 }} />}
                label={task.errorCount}
                size="small"
                color="error"
                sx={{ fontSize: '0.6rem', height: 18 }}
              />
            )}
          </Box>
          <Box onClick={(e) => e.stopPropagation()}>
            {renderActions()}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
