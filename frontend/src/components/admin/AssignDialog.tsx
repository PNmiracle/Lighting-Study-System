import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useTeachers } from '../../hooks/useTeachers';
import { useAssignStudent } from '../../hooks/useUsers';

interface AssignDialogProps {
  open: boolean;
  studentId: string;
  onClose: () => void;
}

/**
 * 师生分配弹窗
 * 下拉选择老师，分配给学生
 */
export default function AssignDialog({ open, studentId, onClose }: AssignDialogProps) {
  const { data: teachers, isLoading } = useTeachers();
  const assignStudent = useAssignStudent();
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');

  useEffect(() => {
    if (open) setSelectedTeacherId('');
  }, [open]);

  const handleAssign = async () => {
    try {
      await assignStudent.mutateAsync({
        studentId,
        teacherId: selectedTeacherId || null,
      });
      onClose();
    } catch {
      // 错误已由拦截器处理
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>分配老师</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <FormControl fullWidth>
              <InputLabel>选择老师</InputLabel>
              <Select
                value={selectedTeacherId}
                label="选择老师"
                onChange={(e) => setSelectedTeacherId(e.target.value)}
              >
                <MenuItem value="">
                  <em>取消分配</em>
                </MenuItem>
                {teachers?.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id} disabled={teacher.status !== 'ACTIVE'}>
                    {teacher.name}（{teacher.studentCount}/{teacher.maxStudents} 名学生）
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          取消
        </Button>
        <Button
          onClick={handleAssign}
          variant="contained"
          disabled={assignStudent.isPending}
        >
          {assignStudent.isPending ? '分配中...' : '确认分配'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
