import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import { ThemeToggle } from './components/ThemeToggle';
import { DriversPage } from './features/drivers';
import { LoadsPage } from './features/loads';
import { TrucksPage } from './features/trucks';
import { auth } from './lib/firebase';
import NotFound from './pages/NotFound';
import { DashboardPage } from './features/dashboard';
import { LoginPage, useAuthStore } from './features/auth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
      {
        path: '/drivers',
        element: <DriversPage />,
      },
      {
        path: '/trucks',
        element: <TrucksPage />,
      },
      {
        path: '/loads',
        element: <LoadsPage />,
      },
    ],
    errorElement: <NotFound />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <RouterProvider router={router} />
      <ThemeToggle />
    </>
  );
}

export default App;
