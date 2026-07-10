import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { Role } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * 认证状态 Store
 * 使用 Zustand 管理，通过 persist 中间件持久化到 localStorage
 */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (token: string, user: User) => {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        set({ token: null, user: null, isAuthenticated: false });
      },

      updateUser: (partial: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...partial } });
        }
      },
    }),
    {
      name: STORAGE_KEYS.USER,
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

/**
 * 获取角色首页路径
 */
export function getRoleHomePath(role: Role): string {
  switch (role) {
    case Role.ADMIN:
      return '/admin';
    case Role.TEACHER:
      return '/teacher';
    case Role.STUDENT:
      return '/student';
    default:
      return '/login';
  }
}
