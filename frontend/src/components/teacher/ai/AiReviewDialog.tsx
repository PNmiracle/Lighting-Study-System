import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { useAiTaskDetail, useReviewAiTask } from '../../../hooks/useAiTasks';
import { AI_CONFIDENCE_LABELS, AI_CONFIDENCE_COLORS } from '../../../utils/constants';
import ReviewResultList from './ReviewResultList';

interface AiReviewDialogProps {
  taskId: string | null;
  onClose: () => void;
}

export default function AiReviewDialog({ taskId, onClose }: AiReviewDialogProps) {
  const [feedback, setFeedback] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data: task, isLoading } = useAiTaskDetail(taskId);
  const reviewMutation = useReviewAiTask();

  // 初始化选中所有导师
  useEffect(() => {
    if (task?.resultSupervisorIds) {
      setSelectedIds(new Set(task.resultSupervisorIds.map((r) => r.supervisorId)));
    }
  }, [task]);

  const handleToggleSelect = (supervisorId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(supervisorId)) {
        next.delete(supervisorId);
      } else {
        next.add(supervisorId);
      }
      return next;
    });
  };

  const handleApprove = async () => {
    if (!taskId) return;
    await reviewMutation.mutateAsync({
      id: taskId,
      data: {
        action: 'APPROVE',
        feedback: feedback || undefined,
      },
    });
    onClose();
  };

  const handleReject = async () => {
    if (!taskId) return;
    await reviewMutation.mutateAsync({
      id: taskId,
      data: {
        action: 'REJECT',
        feedback: feedback || undefined,
      },
    });
    onClose();
  };

  const results = task?.resultSupervisorIds || [];

  return (
    <Dialog open={!!taskId} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        审核 AI 选导结果：{task?.student?.name || task?.studentName || ''}
        {task && (
          <Chip
            label={`初选`}
            size="small"
            variant="outlined"
            sx={{ ml: 1, fontSize: '0.7rem' }}
          />
        )}
      </DialogTitle>

      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : !task ? (
          <Alert severity="error">加载任务详情失败</Alert>
        ) : (
          <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
            {/* 左栏：AI 搜索到的导师列表 */}
            <Box sx={{ flex: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                AI 搜索到的导师 ({results.length})
              </Typography>
              {results.length > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  点击导师可切换选中/取消
                </Typography>
              )}
              <ReviewResultList
                results={results}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
              />
            </Box>

            {/* 右栏：审核操作面板 */}
            <Box sx={{ flex: 1, borderLeft: '1px solid #e0e0e0', pl: 3 }}>
              {/* 置信度 */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  AI 自检结果
                </Typography>
                {task.confidence ? (
                  <Chip
                    label={AI_CONFIDENCE_LABELS[task.confidence]}
                    size="small"
                    sx={{
                      bgcolor: AI_CONFIDENCE_COLORS[task.confidence],
                      color: '#fff',
                      fontWeight: 600,
                    }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">--</Typography>
                )}
              </Box>

              {/* AI 反馈摘要 */}
              {task.aiFeedback && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    执行摘要
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    {task.aiFeedback.split('\n').filter((l: string) => l.includes('[完成]')).join('\n') || task.aiFeedback}
                  </Typography>
                </Box>
              )}

              {/* 审核备注 */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  审核备注
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  maxRows={6}
                  size="small"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="可选：填写审核备注..."
                />
              </Box>

              {/* 选中计数 */}
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                已选择 {selectedIds.size}/{results.length} 位导师
              </Typography>

              {/* 操作按钮 */}
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={handleReject}
                  disabled={reviewMutation.isPending}
                  fullWidth
                >
                  驳回
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={handleApprove}
                  disabled={reviewMutation.isPending || selectedIds.size === 0}
                  fullWidth
                >
                  通过审核
                </Button>
              </Box>

              {reviewMutation.isError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {String((reviewMutation.error as any)?.response?.data?.message || '审核失败')}
                </Alert>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
}
