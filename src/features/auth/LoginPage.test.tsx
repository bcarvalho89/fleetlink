import { signInWithEmailAndPassword } from 'firebase/auth';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen, waitFor } from '@/test/test-utils';

import { useAuth } from './hooks/useAuth';
import LoginPage from './LoginPage';
import { useAuthStore } from './store/authStore';
import { User } from './types/User';

vi.mock('sonner');

vi.mock('./hooks/useAuth');
vi.mock('./store/authStore');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginPage', () => {
  const mockLogin = vi.fn();
  type AuthStoreState = {
    login: (user: User) => void;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as Mock).mockReturnValue(false);
    (useAuthStore as unknown as Mock).mockImplementation(
      (selector: (state: AuthStoreState) => void) =>
        selector({ login: mockLogin }),
    );
  });

  it('should render the login form', () => {
    render(<LoginPage />, { wrapper: MemoryRouter });

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should call login and navigate on successful submission', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    (signInWithEmailAndPassword as Mock).mockResolvedValue({ user: mockUser });

    const { user } = render(<LoginPage />, { wrapper: MemoryRouter });

    await user.type(
      screen.getByLabelText(/email address/i),
      'test@example.com',
    );
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123',
      );
      expect(mockLogin).toHaveBeenCalledWith({
        uid: mockUser.uid,
        email: mockUser.email,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should show an error toast on failed submission', async () => {
    const errorMessage = 'Invalid credentials';
    (signInWithEmailAndPassword as Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    const { user } = render(<LoginPage />, { wrapper: MemoryRouter });

    await user.type(
      screen.getByLabelText(/email address/i),
      'test@example.com',
    );
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
