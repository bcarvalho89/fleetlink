import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LoadingIndicator from './components/common/LoadingIndicator';
import { ThemeToggle } from './components/common/ThemeToggle';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { LoginPage, useAuthStore } from './features/auth';
import { DashboardPage } from './features/dashboard';
import { DriversPage } from './features/drivers';
import { LoadsPage } from './features/loads';
import { NotFoundPage } from './features/misc';
import { TrucksPage } from './features/trucks';
import { auth } from './lib/firebase';

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
    errorElement: <NotFoundPage />,
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
    return (
      <>
        <LoadingIndicator />
        <div className="hidden">
          <ThemeToggle />
        </div>
      </>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      <ThemeToggle />
    </>
  );
}

export default App;
