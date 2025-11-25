import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import { ThemeToggle } from './components/ThemeToggle';
import { auth } from './lib/firebase';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import TrucksPage from './pages/Trucks';
import { useAuthStore } from './store/auth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/drivers',
        element: <p>Drivers Page</p>,
      },
      {
        path: '/trucks',
        element: <TrucksPage />,
      },
      {
        path: '/loads',
        element: <p>Loads Page</p>,
      },
    ],
    errorElement: <NotFound />,
  },
  {
    path: '/login',
    element: <Login />,
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
