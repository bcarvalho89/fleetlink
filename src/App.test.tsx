import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Mock, vi } from 'vitest';

import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

vi.mock('./hooks/useAuth');

vi.mock('./lib/firebase', () => ({
  auth: {},
  db: {},
}));

vi.mock('./pages/Dashboard', () => ({
  default: () => <div>Dashboard</div>,
}));
vi.mock('./pages/Login', () => ({ default: () => <div>Login</div> }));
vi.mock('./pages/NotFound', () => ({
  default: () => <div>Not Found</div>,
}));

const mockedUseAuth = useAuth as Mock;

const routesConfig = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <h1>Dashboard</h1>,
      },
    ],
    errorElement: <h1>Not Found</h1>,
  },
  {
    path: '/login',
    element: <h1>Login</h1>,
  },
];

describe('App Routing', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render Dashboard for authenticated user on root path', () => {
    mockedUseAuth.mockReturnValue(true);
    const router = createMemoryRouter(routesConfig, {
      initialEntries: ['/'],
    });

    render(<RouterProvider router={router} />);

    expect(
      screen.getByRole('heading', { name: 'Dashboard' }),
    ).toBeInTheDocument();
  });

  it('should redirect to Login for unauthenticated user on root path', () => {
    mockedUseAuth.mockReturnValue(false);
    const router = createMemoryRouter(routesConfig, {
      initialEntries: ['/'],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });

  it('should render Login page on /login path', () => {
    mockedUseAuth.mockReturnValue(false);
    const router = createMemoryRouter(routesConfig, {
      initialEntries: ['/login'],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });

  it('should render Not Found for a non-existent route', () => {
    const router = createMemoryRouter(routesConfig, {
      initialEntries: ['/some/bad/route'],
    });

    render(<RouterProvider router={router} />);

    expect(
      screen.getByRole('heading', { name: 'Not Found' }),
    ).toBeInTheDocument();
  });
});
