import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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
    <div className="bg-slate-900 min-h-screen text-white">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
