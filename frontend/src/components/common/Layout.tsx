import { AppBar, Toolbar, Typography, Box, Button, Avatar, Menu, MenuItem, Chip, Tabs, Tab } from '@mui/material';
import { School } from '@mui/icons-material';
import { useState, MouseEvent, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ROLE_LABELS } from '../../utils/constants';
import { Role } from '../../types';

/**
 * 通用布局组件
 * 顶栏（logo + 用户信息 + 退出）+ 内容区
 */
interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // 老师导航标签
  const teacherTabs = [
    { label: '工作台', path: '/teacher' },
    { label: 'AI 选导', path: '/teacher/ai-tasks' },
  ];

  const currentTeacherTab = teacherTabs.findIndex((tab) => location.pathname === tab.path);

  const roleColor =
    user?.role === Role.ADMIN
      ? { bg: '#e3f2fd', color: '#1565c0' }
      : user?.role === Role.TEACHER
      ? { bg: '#f3e5f5', color: '#7b1fa2' }
      : { bg: '#e8f5e9', color: '#2e7d32' };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#fff', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar sx={{ minHeight: '56px !important' }}>
          <School sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary', fontWeight: 700, fontSize: '1.1rem' }}>
            留学选导管理系统
          </Typography>

          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Chip
                label={ROLE_LABELS[user.role]}
                size="small"
                sx={{
                  bgcolor: roleColor.bg,
                  color: roleColor.color,
                  fontWeight: 600,
                }}
              />
              <Box onClick={handleMenuOpen} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                  {user.name.charAt(0)}
                </Avatar>
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  {user.name}
                </Typography>
              </Box>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} sx={{ mt: 1 }}>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main', minWidth: 140 }}>
                  退出登录
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>

        {/* 老师导航标签 */}
        {user?.role === Role.TEACHER && (
          <Tabs
            value={currentTeacherTab >= 0 ? currentTeacherTab : 0}
            onChange={(_, newValue) => navigate(teacherTabs[newValue].path)}
            sx={{
              px: 2,
              minHeight: 40,
              '& .MuiTab-root': { minHeight: 40, fontSize: '0.8rem', py: 0 },
            }}
          >
            {teacherTabs.map((tab) => (
              <Tab key={tab.path} label={tab.label} />
            ))}
          </Tabs>
        )}
      </AppBar>

      <Box component="main">{children}</Box>
    </Box>
  );
}
