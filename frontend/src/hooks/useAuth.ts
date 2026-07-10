import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth';
import { getRoleHomePath } from '../store/authStore';
import { Role } from '../types';
import { toast } from 'sonner';

/**
 * 认证 Hook
 * 封装 authStore + auth API，提供登录、登出、获取当前用户等方法
 */
export function useAuth() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, login, logout, updateUser } = useAuthStore();

  /**
   * 登录
   */
  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const result = await authApi.login(email, password);
      login(result.token, result.user);
      toast.success(`欢迎回来，${result.user.name}！`);
      const homePath = getRoleHomePath(result.user.role as Role);
      navigate(homePath, { replace: true });
      return result;
    },
    [login, navigate]
  );

  /**
   * 登出
   */
  const handleLogout = useCallback(() => {
    logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  /**
   * 获取当前用户信息
   */
  const fetchMe = useCallback(async () => {
    try {
      const userInfo = await authApi.getMe();
      updateUser(userInfo);
      return userInfo;
    } catch {
      logout();
    }
  }, [updateUser, logout]);

  // 首次加载时如果有 token，验证一下用户信息
  useEffect(() => {
    if (token && !user) {
      fetchMe();
    }
  }, [token, user, fetchMe]);

  return {
    user,
    token,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
    fetchMe,
  };
}
