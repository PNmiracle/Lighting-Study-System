import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import { PersonAdd, MoreVert } from '@mui/icons-material';
import { useTeachers } from '../../hooks/useTeachers';
import { useToggleUserStatus } from '../../hooks/useUsers';
import UserCreateDialog from './UserCreateDialog';
import { Role, UserStatus } from '../../types';
import { USER_STATUS_LABELS } from '../../utils/constants';
import { Menu, MenuItem } from '@mui/material';

/**
 * 老师管理 Tab
 * 列表 + 添加弹窗 + 启用/禁用
 */
export default function TeacherManageTab() {
  const { data: teachers, isLoading } = useTeachers();
  const toggleStatus = useToggleUserStatus();
  const [createOpen, setCreateOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; id: string; status: string } | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: string, status: string) => {
    setMenuAnchor({ el: event.currentTarget, id, status });
  };

  const handleMenuClose = () => setMenuAnchor(null);

  const handleToggleStatus = () => {
    if (!menuAnchor) return;
    const newStatus = menuAnchor.status === UserStatus.ACTIVE ? 'DISABLED' : 'ACTIVE';
    toggleStatus.mutate({ id: menuAnchor.id, status: newStatus });
    handleMenuClose();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">老师管理</Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setCreateOpen(true)}
          size="small"
        >
          添加老师
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : !teachers || teachers.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">暂无老师数据</Typography>
          </CardContent>
        </Card>
      ) : (
        <List>
          {teachers.map((teacher) => (
            <Card key={teacher.id} sx={{ mb: 1 }}>
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <ListItem disablePadding>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" fontWeight={600}>
                          {teacher.name}
                        </Typography>
                        <Chip
                          label={USER_STATUS_LABELS[teacher.status as UserStatus] || teacher.status}
                          size="small"
                          color={teacher.status === 'ACTIVE' ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary" component="span">
                        {teacher.email} · 名下 {teacher.studentCount} 名学生 / 上限 {teacher.maxStudents}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => handleMenuClick(e, teacher.userId, teacher.status)}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </CardContent>
            </Card>
          ))}
        </List>
      )}

      <UserCreateDialog open={createOpen} onClose={() => setCreateOpen(false)} defaultRole={Role.TEACHER} />

      <Menu
        anchorEl={menuAnchor?.el}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        sx={{ mt: 1 }}
      >
        <MenuItem
          onClick={handleToggleStatus}
          sx={{ color: menuAnchor?.status === 'ACTIVE' ? 'error.main' : 'success.main', minWidth: 120 }}
        >
          {menuAnchor?.status === 'ACTIVE' ? '禁用账号' : '启用账号'}
        </MenuItem>
      </Menu>
    </Box>
  );
}
