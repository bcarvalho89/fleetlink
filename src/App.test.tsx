import { onAuthStateChanged } from 'firebase/auth';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Mock, vi, afterEach, beforeEach, describe, expect, it } from 'vitest';

import App from '@/App';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { useAuth, useAuthStore } from '@/features/auth';

import { render, screen, waitFor } from './test/test-utils';

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  getAuth: vi.fn(),
}));

vi.mock('./lib/firebase', () => ({
  auth: {},
  db: {},
}));

vi.mock('@/features/dashboard', () => ({
  DashboardPage: () => <div>Dashboard</div>,
}));

vi.mock('@/features/auth', async importOriginal => {
  const original = await importOriginal<typeof import('@/features/auth')>();
  return {
    ...original,
    useAuth: vi.fn(),
    useAuthStore: vi.fn(),
    LoginPage: () => <div>Login</div>,
  };
});

vi.mock('@/features/misc', () => ({
  NotFoundPage: () => <div>Not Found</div>,
}));

const mockedUseAuth = useAuth as Mock;
const mockedUseAuthStore = useAuthStore as unknown as Mock;

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

describe('App Component', () => {
  let mockSetUser: Mock;

  beforeEach(() => {
    mockSetUser = vi.fn();

    mockedUseAuthStore.mockReturnValue({ setUser: mockSetUser });
    mockedUseAuth.mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should display loading indicator initially', () => {
    (onAuthStateChanged as Mock).mockImplementation(() => vi.fn()); // Mock unsubscribe
    render(<App />);
    expect(screen.getByLabelText('Loading app')).toBeInTheDocument();
  });

  it('should render the app after auth state is determined', async () => {
    const mockUser = { uid: '123', email: 'test@test.com' };

    (onAuthStateChanged as Mock).mockImplementation((_, callback) => {
      callback(mockUser);
      return vi.fn();
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByLabelText('Loading app')).not.toBeInTheDocument();
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
    });
  });
});

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
