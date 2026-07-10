import { create } from 'zustand';

/**
 * 全局 UI 状态 Store
 * 管理全局 loading 等UI状态
 */
interface UIState {
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  globalLoading: false,
  setGlobalLoading: (loading: boolean) => set({ globalLoading: loading }),
}));
