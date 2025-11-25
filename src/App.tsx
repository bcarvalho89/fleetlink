import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore } from './store/auth';

import { ThemeToggle } from './components/ThemeToggle';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
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
    <main>
      <RouterProvider router={router} />
      <ThemeToggle />
    </main>
  );
}

export default App;
