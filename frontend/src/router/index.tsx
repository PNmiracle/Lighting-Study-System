import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import TeacherWorkspace from '../pages/teacher/TeacherWorkspace';
import AiTaskKanban from '../pages/teacher/AiTaskKanban';
import StudentBrowsePage from '../pages/student/StudentBrowsePage';
import Layout from '../components/common/Layout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { Role } from '../types';

/**
 * 路由配置
 * 公开路由: /login
 * 受保护路由: /admin, /teacher, /teacher/ai-tasks, /student
 */
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <Layout>
          <AdminDashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/teacher',
    element: (
      <ProtectedRoute allowedRoles={[Role.TEACHER]}>
        <Layout>
          <TeacherWorkspace />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/teacher/ai-tasks',
    element: (
      <ProtectedRoute allowedRoles={[Role.TEACHER]}>
        <Layout>
          <AiTaskKanban />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/student',
    element: (
      <ProtectedRoute allowedRoles={[Role.STUDENT]}>
        <Layout>
          <StudentBrowsePage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
