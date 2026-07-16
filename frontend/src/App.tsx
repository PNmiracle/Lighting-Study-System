import { RouterProvider } from 'react-router-dom';
import { router } from './router';

/**
 * 根组件
 * 包裹 RouterProvider
 */
export default function App() {
  return <RouterProvider router={router} />;
}
