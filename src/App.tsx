import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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
  return (
    <>
      <RouterProvider router={router} />
      <ThemeToggle />
    </>
  );
}

export default App;
