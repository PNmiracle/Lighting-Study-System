import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Box,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateUser } from '../../hooks/useUsers';
import { Role } from '../../types';

const createUserSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(8, '密码至少8位'),
  name: z.string().min(1, '姓名不能为空'),
  role: z.nativeEnum(Role),
});

type CreateUserData = z.infer<typeof createUserSchema>;

interface UserCreateDialogProps {
  open: boolean;
  onClose: () => void;
  defaultRole?: Role.TEACHER | Role.STUDENT;
}

/**
 * 通用用户创建弹窗
 * 创建老师或学生账号（自动创建关联记录）
 */
export default function UserCreateDialog({ open, onClose, defaultRole = Role.TEACHER }: UserCreateDialogProps) {
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      role: defaultRole,
    },
  });

  const selectedRole = watch('role');

  const handleClose = () => {
    reset({ email: '', password: '', name: '', role: defaultRole });
    onClose();
  };

  const onSubmit = async (data: CreateUserData) => {
    try {
      await createUser.mutateAsync(data);
      handleClose();
    } catch {
      // 错误已由拦截器处理
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{defaultRole === Role.TEACHER ? '添加老师' : '添加学生'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              {...register('name')}
              label="姓名"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              {...register('email')}
              label="邮箱"
              type="email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              {...register('password')}
              label="密码"
              type="password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            {!defaultRole && (
              <FormControl>
                <FormLabel>角色</FormLabel>
                <RadioGroup row>
                  <FormControlLabel
                    value={Role.TEACHER}
                    control={<Radio {...register('role')} />}
                    label="老师"
                  />
                  <FormControlLabel
                    value={Role.STUDENT}
                    control={<Radio {...register('role')} />}
                    label="学生"
                  />
                </RadioGroup>
              </FormControl>
            )}

            {createUser.isError && (
              <Alert severity="error">
                {createUser.error?.message || '创建失败'}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">
            取消
          </Button>
          <Button type="submit" variant="contained" disabled={createUser.isPending}>
            {createUser.isPending ? '创建中...' : '创建'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
