import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { AiTaskStage, AiTaskRound, AiTaskPriority, AiTaskSummary, StudentSummary } from '../../types';
import {
  STAGE_COLUMN_ORDER,
  AI_STAGE_LABELS,
  AI_ROUND_LABELS,
  AI_PRIORITY_LABELS,
} from '../../utils/constants';
import {
  useAiTasks,
  useCreateAiTask,
  useExecuteAiTask,
} from '../../hooks/useAiTasks';
import { useStudentList } from '../../hooks/useStudents';
import KanbanColumn from '../../components/teacher/ai/KanbanColumn';
import CreateTaskDialog from '../../components/teacher/ai/CreateTaskDialog';
import AiTaskDetailDrawer from '../../components/teacher/ai/TaskDetailDrawer';
import AiReviewDialog from '../../components/teacher/ai/AiReviewDialog';

export default function AiTaskKanban() {
  // 筛选状态
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [roundFilter, setRoundFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [studentSearch, setStudentSearch] = useState('');
  const [myTasksOnly, setMyTasksOnly] = useState(true);

  // 弹窗状态
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [reviewTaskId, setReviewTaskId] = useState<string | null>(null);

  // 数据查询
  const { tasks, isLoading, isError, refetch } = useAiTasks({
    stage: stageFilter !== 'ALL' ? stageFilter : undefined,
    round: roundFilter !== 'ALL' ? roundFilter : undefined,
    priority: priorityFilter !== 'ALL' ? priorityFilter : undefined,
  });

  const { data: studentsData, isLoading: studentsLoading } = useStudentList();

  // Mutations
  const createAiTask = useCreateAiTask();
  const executeAiTask = useExecuteAiTask();

  // 将学生数据展平为 StudentSummary 列表
  const students: StudentSummary[] = Array.isArray(studentsData) ? studentsData as StudentSummary[] : [];

  // 按 stage 分组
  const groupedTasks: Record<string, AiTaskSummary[]> = {};
  STAGE_COLUMN_ORDER.forEach((stage) => {
    groupedTasks[stage] = tasks.filter((t) => t.stage === stage);
  });

  // 创建并执行
  const handleCreateAndExecute = useCallback(
    async (data: { studentId: string; prompt: string; round: AiTaskRound; priority: AiTaskPriority }) => {
      const task = await createAiTask.mutateAsync(data);
      await executeAiTask.mutateAsync({ id: task.id });
      setCreateDialogOpen(false);
    },
    [createAiTask, executeAiTask]
  );

  // 仅创建
  const handleCreateOnly = useCallback(
    async (data: { studentId: string; prompt: string; round: AiTaskRound; priority: AiTaskPriority }) => {
      await createAiTask.mutateAsync(data);
      setCreateDialogOpen(false);
    },
    [createAiTask]
  );

  // 执行任务
  const handleExecute = useCallback(
    async (taskId: string) => {
      await executeAiTask.mutateAsync({ id: taskId });
    },
    [executeAiTask]
  );

  // 查看详情
  const handleView = useCallback((taskId: string) => {
    setDetailTaskId(taskId);
  }, []);

  // 审核
  const handleReview = useCallback((taskId: string) => {
    setReviewTaskId(taskId);
  }, []);

  // 错误状态
  if (isError) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>加载失败，请检查网络连接</Alert>
        <Button variant="outlined" onClick={() => refetch()}>重试</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部工具栏 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          AI 批量选导
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setCreateDialogOpen(true)}>
          新建任务
        </Button>
      </Box>

      {/* 筛选栏 */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          select
          size="small"
          label="阶段"
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="ALL">全部阶段</MenuItem>
          {Object.entries(AI_STAGE_LABELS).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          label="轮次"
          value={roundFilter}
          onChange={(e) => setRoundFilter(e.target.value)}
          sx={{ minWidth: 100 }}
        >
          <MenuItem value="ALL">全部轮次</MenuItem>
          {Object.entries(AI_ROUND_LABELS).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          label="优先级"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          sx={{ minWidth: 100 }}
        >
          <MenuItem value="ALL">全部优先级</MenuItem>
          {Object.entries(AI_PRIORITY_LABELS).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          size="small"
          placeholder="搜索学生..."
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
          sx={{ minWidth: 150 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={myTasksOnly}
              onChange={(e) => setMyTasksOnly(e.target.checked)}
              size="small"
            />
          }
          label="我的任务"
          sx={{ ml: 1 }}
        />
      </Box>

      {/* 看板主体 */}
      {isLoading && tasks.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            flex: 1,
            pb: 2,
          }}
        >
          {STAGE_COLUMN_ORDER.map((stage) => {
            let columnTasks = groupedTasks[stage] || [];
            // 学生搜索过滤
            if (studentSearch) {
              columnTasks = columnTasks.filter((t) =>
                t.studentName.toLowerCase().includes(studentSearch.toLowerCase())
              );
            }
            return (
              <KanbanColumn
                key={stage}
                stage={stage}
                tasks={columnTasks}
                onExecute={handleExecute}
                onView={handleView}
                onReview={handleReview}
              />
            );
          })}
        </Box>
      )}

      {/* 创建任务弹窗 */}
      <CreateTaskDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreateOnly}
        onCreateAndExecute={handleCreateAndExecute}
        students={students}
        studentsLoading={studentsLoading}
      />

      {/* 任务详情抽屉 */}
      <AiTaskDetailDrawer
        taskId={detailTaskId}
        onClose={() => setDetailTaskId(null)}
        onReview={(id) => {
          setDetailTaskId(null);
          setReviewTaskId(id);
        }}
      />

      {/* 审核弹窗 */}
      <AiReviewDialog
        taskId={reviewTaskId}
        onClose={() => setReviewTaskId(null)}
      />
    </Box>
  );
}
