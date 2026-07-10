import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '密码不能为空'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * 登录表单
 * 邮箱 + 密码 + 提交
 */
export default function LoginForm() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);
    try {
      await login(data.email, data.password);
    } catch (err: any) {
      setErrorMsg(err?.message || '登录失败，请重试');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg(null)}>
          {errorMsg}
        </Alert>
      )}

      <TextField
        {...register('email')}
        label="邮箱"
        fullWidth
        margin="normal"
        placeholder="请输入邮箱"
        error={!!errors.email}
        helperText={errors.email?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        {...register('password')}
        label="密码"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        margin="normal"
        placeholder="请输入密码"
        error={!!errors.password}
        helperText={errors.password?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock fontSize="small" color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isSubmitting}
        sx={{ mt: 3, mb: 2, py: 1.2 }}
      >
        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : '登 录'}
      </Button>
    </Box>
  );
}
