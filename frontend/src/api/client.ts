import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { STORAGE_KEYS } from '../utils/constants';
import type { ApiResponse } from '../types';

/**
 * Axios 实例
 * 请求拦截器：自动注入 Authorization header
 * 响应拦截器：统一处理错误码，401 时清除登录状态
 */
const client = axios.create({
  baseURL: '/api',
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：注入 token
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：统一错误处理
client.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, data, message } = response.data;

    // code === 0 表示成功
    if (code === 0) {
      return data as any;
    }

    // 业务错误
    toast.error(message || '操作失败');
    return Promise.reject(new Error(message || '请求失败'));
  },
  (error: AxiosError<ApiResponse>) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || '请求失败';

      // 401 — Token 无效或过期
      if (status === 401) {
        const authStore = useAuthStore.getState();
        authStore.logout();
        toast.error('登录已过期，请重新登录');
        // 延迟跳转避免在 render 中触发
        setTimeout(() => {
          window.location.href = '/login';
        }, 500);
        return Promise.reject(new Error('登录已过期'));
      }

      // 403 — 权限不足
      if (status === 403) {
        toast.error('权限不足');
        return Promise.reject(new Error('权限不足'));
      }

      // 404 — 资源不存在
      if (status === 404) {
        toast.error('资源不存在');
        return Promise.reject(new Error('资源不存在'));
      }

      // 500 — 服务器错误
      if (status >= 500) {
        toast.error('服务器错误，请稍后重试');
        return Promise.reject(new Error('服务器错误'));
      }

      // 其他业务错误
      toast.error(message);
      return Promise.reject(new Error(message));
    }

    // 网络错误
    if (error.request) {
      toast.error('网络连接失败，请检查网络');
      return Promise.reject(new Error('网络连接失败'));
    }

    return Promise.reject(error);
  }
);

export default client;
