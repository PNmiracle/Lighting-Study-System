import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Paper,
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { useStudents } from '../../hooks/useUsers';
import { useAssignments, useCreateAssignment, useUpdateAssignment } from '../../hooks/useAssignments';
import StudentCard from '../../components/teacher/StudentCard';
import SupervisorTable from '../../components/teacher/SupervisorTable';
import AddSupervisorDialog from '../../components/teacher/AddSupervisorDialog';
import EditAssignmentDialog from '../../components/teacher/EditAssignmentDialog';
import type { AssignmentDetail, Supervisor } from '../../types';
import { MatchLevel } from '../../types';

/**
 * 老师工作台
 * 左侧：学生卡片列表（含状态徽章）
 * 右侧：选中学生的导师表格
 * 顶部：添加导师按钮
 * 含 10s 轮询刷新意向
 */
export default function TeacherWorkspace() {
  const { data: students, isLoading: studentsLoading } = useStudents();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialog, setEditDialog] = useState<AssignmentDetail | null>(null);

  // 获取选中学生的推荐记录，启用 10s 轮询
  const { data: assignments, isLoading: assignmentsLoading } = useAssignments(
    selectedStudentId || undefined,
    true
  );

  const createAssignment = useCreateAssignment();
  const updateAssignment = useUpdateAssignment();

  const selectedStudent = students?.find((s) => s.id === selectedStudentId);

  const handleAddSupervisor = async (
    supervisor: Supervisor,
    notes: string,
    matchLevel: string | null
  ) => {
    if (!selectedStudentId) return;
    try {
      await createAssignment.mutateAsync({
        studentId: selectedStudentId,
        supervisorId: supervisor.id,
        notes: notes || undefined,
        matchLevel: matchLevel as MatchLevel | null | undefined,
      });
    } catch {
      // handled by interceptor
    }
  };

  const handleEditAssignment = async (
    id: string,
    data: { notes: string; matchLevel: MatchLevel | null }
  ) => {
    try {
      await updateAssignment.mutateAsync({ id, data });
    } catch {
      // handled by interceptor
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          老师工作台
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setAddDialogOpen(true)}
          disabled={!selectedStudentId}
          size="small"
        >
          添加导师
        </Button>
      </Box>

      <Grid container spacing={2}>
        {/* 左侧：学生列表 */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, minHeight: '70vh' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              我的学生 ({students?.length || 0})
            </Typography>
            {studentsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={24} />
              </Box>
            ) : !students || students.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                暂无分配的学生
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {students.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    selected={selectedStudentId === student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* 右侧：导师表格 */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 2, minHeight: '70vh' }}>
            {selectedStudent ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {selectedStudent.name} 的导师推荐列表
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedStudent.grade || '-'} · {selectedStudent.targetCountry || '-'} ·{' '}
                      {selectedStudent.targetMajor || '-'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    共 {assignments?.length || 0} 位导师
                  </Typography>
                </Box>
                <SupervisorTable
                  assignments={assignments || []}
                  loading={assignmentsLoading}
                  onEdit={(assignment) => setEditDialog(assignment)}
                />
              </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '60vh',
                  color: 'text.secondary',
                }}
              >
                <Typography variant="body1">← 请从左侧选择一位学生</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  选择后可查看和管理该学生的导师推荐列表
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <AddSupervisorDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onConfirm={handleAddSupervisor}
      />

      <EditAssignmentDialog
        open={!!editDialog}
        assignment={editDialog}
        onClose={() => setEditDialog(null)}
        onConfirm={handleEditAssignment}
      />
    </Box>
  );
}
