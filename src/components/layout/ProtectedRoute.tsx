import { Navigate, Outlet } from 'react-router-dom';

import Layout from './MainContent';
import { useAuth } from '@/features/auth';

export default function ProtectedRoute() {
  const isAuth = useAuth();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
