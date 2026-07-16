import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Autocomplete,
  Chip,
  CircularProgress,
} from '@mui/material';
import { AiTaskRound, AiTaskPriority, StudentSummary } from '../../../types';
import { AI_ROUND_LABELS, AI_PRIORITY_LABELS } from '../../../utils/constants';
import PromptTemplateSelector from './PromptTemplateSelector';
import type { PromptTemplate } from '../../../types';

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { studentId: string; prompt: string; round: AiTaskRound; priority: AiTaskPriority }) => void;
  onCreateAndExecute: (data: { studentId: string; prompt: string; round: AiTaskRound; priority: AiTaskPriority }) => void;
  students: StudentSummary[];
  studentsLoading: boolean;
}

export default function CreateTaskDialog({
  open,
  onClose,
  onCreate,
  onCreateAndExecute,
  students,
  studentsLoading,
}: CreateTaskDialogProps) {
  const [selectedStudent, setSelectedStudent] = useState<StudentSummary | null>(null);
  const [prompt, setPrompt] = useState('');
  const [round, setRound] = useState<AiTaskRound>(AiTaskRound.FIRST);
  const [priority, setPriority] = useState<AiTaskPriority>(AiTaskPriority.P1);
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);

  // 选择学生后自动写基础 prompt
  useEffect(() => {
    if (selectedStudent) {
      const defaultPrompt = `请为 ${selectedStudent.name} 搜索合适的PhD导师。

学生背景：
- 年级：${selectedStudent.grade || '未知'}
- 目标地区：${selectedStudent.targetCountry || '未设置'}
- 目标专业：${selectedStudent.targetMajor || '未设置'}

操作指令：
1. 搜索匹配导师并填入详细信息
2. 填写匹配度备注
3. 验证导师主页链接`;
      setPrompt(defaultPrompt);
    }
  }, [selectedStudent]);

  const handleSelectTemplate = (template: PromptTemplate) => {
    // 替换占位符
    let resolved = template.content;
    if (selectedStudent) {
      resolved = resolved
        .replace(/\{student_name\}/g, selectedStudent.name)
        .replace(/\{target_country\}/g, selectedStudent.targetCountry || '未设置')
        .replace(/\{target_major\}/g, selectedStudent.targetMajor || '未设置')
        .replace(/\{grade\}/g, selectedStudent.grade || '未知');
    }
    setPrompt(resolved);
  };

  const isValid = selectedStudent && prompt.trim();

  const buildData = () => ({
    studentId: selectedStudent!.id,
    prompt: prompt.trim(),
    round,
    priority,
  });

  const handleCreateOnly = () => {
    if (!isValid) return;
    onCreate(buildData());
  };

  const handleCreateAndExecute = () => {
    if (!isValid) return;
    onCreateAndExecute(buildData());
  };

  const handleClose = () => {
    setSelectedStudent(null);
    setPrompt('');
    setRound(AiTaskRound.FIRST);
    setPriority(AiTaskPriority.P1);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>新建 AI 选导任务</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {/* 学生选择 */}
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                学生 *
              </Typography>
              <Autocomplete
                options={students}
                loading={studentsLoading}
                getOptionLabel={(option) => `${option.name} (${option.targetCountry || '未设置'} / ${option.targetMajor || '未设置'})`}
                value={selectedStudent}
                onChange={(_, v) => setSelectedStudent(v)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="选择学生"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {studentsLoading ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
              {selectedStudent && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  已选择：{selectedStudent.name} | 目标地区：{selectedStudent.targetCountry || '未设置'} | 方向：{selectedStudent.targetMajor || '未设置'}
                </Typography>
              )}
            </Box>

            {/* 提示词 */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  提示词 *
                </Typography>
                <Button size="small" variant="outlined" onClick={() => setTemplateSelectorOpen(true)}>
                  从模板库选择
                </Button>
              </Box>
              <TextField
                fullWidth
                multiline
                minRows={6}
                maxRows={12}
                size="small"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="输入 AI 搜索提示词..."
                sx={{ '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '0.8rem' } }}
              />
            </Box>

            {/* 轮次 + 优先级 */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                select
                size="small"
                label="轮次"
                value={round}
                onChange={(e) => setRound(e.target.value as AiTaskRound)}
                sx={{ minWidth: 140 }}
              >
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
                value={priority}
                onChange={(e) => setPriority(e.target.value as AiTaskPriority)}
                sx={{ minWidth: 140 }}
              >
                {Object.entries(AI_PRIORITY_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleCreateOnly} disabled={!isValid} variant="outlined">
            保存草稿
          </Button>
          <Button onClick={handleCreateAndExecute} disabled={!isValid} variant="contained" color="primary">
            创建并执行
          </Button>
        </DialogActions>
      </Dialog>

      <PromptTemplateSelector
        open={templateSelectorOpen}
        onClose={() => setTemplateSelectorOpen(false)}
        onSelect={handleSelectTemplate}
      />
    </>
  );
}
