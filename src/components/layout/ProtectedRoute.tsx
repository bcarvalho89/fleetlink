import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/features/auth';

import Layout from './MainContent';

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
