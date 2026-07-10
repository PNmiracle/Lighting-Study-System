import { Box, Typography, Chip, Paper } from '@mui/material';
import { AiTaskSummary, AiTaskStage } from '../../../types';
import { AI_STAGE_LABELS, AI_STAGE_COLORS } from '../../../utils/constants';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  stage: AiTaskStage;
  tasks: AiTaskSummary[];
  onExecute: (taskId: string) => void;
  onView: (taskId: string) => void;
  onReview: (taskId: string) => void;
}

export default function KanbanColumn({ stage, tasks, onExecute, onView, onReview }: KanbanColumnProps) {
  return (
    <Paper
      sx={{
        bgcolor: '#f5f5f5',
        borderRadius: 2,
        p: 1.5,
        minWidth: 220,
        maxWidth: 260,
        flex: '1 1 0',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 180px)',
      }}
      elevation={0}
    >
      {/* 列标题 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8rem', color: AI_STAGE_COLORS[stage] }}>
          {AI_STAGE_LABELS[stage]}
        </Typography>
        <Chip
          label={tasks.length}
          size="small"
          sx={{
            height: 20,
            minWidth: 24,
            fontSize: '0.7rem',
            bgcolor: AI_STAGE_COLORS[stage],
            color: '#fff',
          }}
        />
      </Box>

      {/* 卡片列表 */}
      <Box sx={{ overflowY: 'auto', flex: 1, pr: 0.5 }}>
        {tasks.length === 0 ? (
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center', py: 3 }}>
            暂无任务
          </Typography>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onExecute={onExecute}
              onView={onView}
              onReview={onReview}
            />
          ))
        )}
      </Box>
    </Paper>
  );
}
