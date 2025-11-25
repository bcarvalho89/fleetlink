import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/hooks';

import Layout from './Layout';

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
