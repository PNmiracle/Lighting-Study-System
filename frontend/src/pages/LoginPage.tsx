import { Box, Card, CardContent, Typography, Divider } from '@mui/material';
import { School } from '@mui/icons-material';
import LoginForm from '../components/auth/LoginForm';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

/**
 * 登录页
 */
export default function LoginPage() {
  const { isAuthenticated, user } = useAuthStore();

  // 已登录用户访问登录页 → 重定向到角色首页
  if (isAuthenticated && user) {
    const homePath =
      user.role === 'ADMIN' ? '/admin' : user.role === 'TEACHER' ? '/teacher' : '/student';
    return <Navigate to={homePath} replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 440, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: '#fff',
                mb: 2,
              }}
            >
              <School fontSize="large" />
            </Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              留学选导管理系统
            </Typography>
            <Typography variant="body2" color="text.secondary">
              请登录您的账号
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <LoginForm />

          <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              测试账号：
            </Typography>
            <Typography variant="caption" color="text.secondary" component="div">
              管理员: admin@test.com / password123
            </Typography>
            <Typography variant="caption" color="text.secondary" component="div">
              老师: teacher1@test.com / password123
            </Typography>
            <Typography variant="caption" color="text.secondary" component="div">
              学生: student1@test.com / password123
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
