import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Menu,
  MenuItem,
} from '@mui/material';
import { PersonAdd, MoreVert } from '@mui/icons-material';
import { useStudents } from '../../hooks/useUsers';
import { useToggleUserStatus } from '../../hooks/useUsers';
import UserCreateDialog from './UserCreateDialog';
import AssignDialog from './AssignDialog';
import StatusBadge from '../common/StatusBadge';
import { Role, UserStatus } from '../../types';
import { USER_STATUS_LABELS } from '../../utils/constants';

/**
 * 学生管理 Tab
 * 表格 + 添加弹窗 + 分配入口 + 启用/禁用
 */
export default function StudentManageTab() {
  const { data: students, isLoading } = useStudents();
  const toggleStatus = useToggleUserStatus();
  const [createOpen, setCreateOpen] = useState(false);
  const [assignDialog, setAssignDialog] = useState<{ open: boolean; studentId: string }>({
    open: false,
    studentId: '',
  });
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; userId: string; status: string; studentId: string } | null>(null);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    userId: string,
    status: string,
    studentId: string
  ) => {
    setMenuAnchor({ el: event.currentTarget, userId, status, studentId });
  };

  const handleMenuClose = () => setMenuAnchor(null);

  const handleToggleStatus = () => {
    if (!menuAnchor) return;
    const newStatus = menuAnchor.status === UserStatus.ACTIVE ? 'DISABLED' : 'ACTIVE';
    toggleStatus.mutate({ id: menuAnchor.userId, status: newStatus });
    handleMenuClose();
  };

  const handleAssign = () => {
    if (!menuAnchor) return;
    setAssignDialog({ open: true, studentId: menuAnchor.studentId });
    handleMenuClose();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">学生管理</Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setCreateOpen(true)}
          size="small"
        >
          添加学生
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : !students || students.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">暂无学生数据</Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Card}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>姓名</TableCell>
                <TableCell>年级</TableCell>
                <TableCell>目标国家</TableCell>
                <TableCell>目标专业</TableCell>
                <TableCell>导师数</TableCell>
                <TableCell>状态</TableCell>
                <TableCell align="center">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {student.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{student.grade || '-'}</TableCell>
                  <TableCell>{student.targetCountry || '-'}</TableCell>
                  <TableCell>{student.targetMajor || '-'}</TableCell>
                  <TableCell>{student.assignmentCount}</TableCell>
                  <TableCell>
                    <StatusBadge status={student.feedbackStatus} />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, student.userId, 'ACTIVE', student.id)}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <UserCreateDialog open={createOpen} onClose={() => setCreateOpen(false)} defaultRole={Role.STUDENT} />

      <AssignDialog
        open={assignDialog.open}
        studentId={assignDialog.studentId}
        onClose={() => setAssignDialog({ open: false, studentId: '' })}
      />

      <Menu anchorEl={menuAnchor?.el} open={Boolean(menuAnchor)} onClose={handleMenuClose} sx={{ mt: 1 }}>
        <MenuItem onClick={handleAssign} sx={{ minWidth: 120 }}>
          分配老师
        </MenuItem>
        <MenuItem onClick={handleToggleStatus} sx={{ color: 'error.main' }}>
          禁用账号
        </MenuItem>
      </Menu>
    </Box>
  );
}
