import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Role } from '../../types';
import { ROLE_HOME_PATH } from '../../utils/constants';

/**
 * 路由守卫组件
 * 检查认证状态和角色权限
 * - 未登录 → 重定向 /login
 * - 角色不匹配 → 重定向到对应角色首页
 */
interface ProtectedRouteProps {
  allowedRoles: Role[];
  children: ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  // 未登录 → 跳转登录页
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 角色不匹配 → 跳转到对应角色首页
  if (!allowedRoles.includes(user.role)) {
    const homePath = ROLE_HOME_PATH[user.role] || '/login';
    return <Navigate to={homePath} replace />;
  }

  return <>{children}</>;
}
