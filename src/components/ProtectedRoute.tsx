import { Navigate, Outlet } from 'react-router-dom';
import Layout from './Layout';
import { useAuth } from '@/hooks';

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
