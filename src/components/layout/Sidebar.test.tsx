/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signOut } from 'firebase/auth';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';

import { useAuthStore } from '@/features/auth';

import { Sidebar } from './Sidebar';

vi.mock('firebase/auth', () => ({
  signOut: vi.fn(),
}));

vi.mock('@/lib/firebase', () => ({ auth: {} }));

vi.mock('@/features/auth', () => ({
  useAuthStore: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
  };
});

describe('Sidebar', () => {
  const mockLogout = vi.fn();
  const mockOnSidebarToggle = vi.fn();
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    (signOut as Mock).mockClear();
    vi.clearAllMocks();
    user = userEvent.setup();
    (useAuthStore as any).mockReturnValue({
      user: { email: 'test@example.com' },
      logout: mockLogout,
    });
  });

  it('should render navigation links, email and logout button when open', () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onSidebarToogle={mockOnSidebarToggle} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('link', { name: /dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /drivers/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /trucks/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /loads/i })).toBeInTheDocument();

    expect(screen.queryByText('test@example.com')).toBeVisible();

    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('should call onSidebarToggle when toggle button is clicked', async () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onSidebarToogle={mockOnSidebarToggle} />
      </MemoryRouter>,
    );

    const toggleButton = screen.getByRole('button', { name: 'Toggle sidebar' });

    await user.click(toggleButton);
    expect(mockOnSidebarToggle).toHaveBeenCalledTimes(1);
  });

  it('should display user email when open', () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onSidebarToogle={mockOnSidebarToggle} />
      </MemoryRouter>,
    );
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should handle logout successfully', async () => {
    (signOut as Mock).mockResolvedValue(true);

    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onSidebarToogle={mockOnSidebarToggle} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /logout/i }));

    await vi.waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(mockLogout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('should show an alert if logout fails', async () => {
    const errorMessage = 'Logout failed';

    (signOut as Mock).mockRejectedValue(new Error(errorMessage));

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onSidebarToogle={mockOnSidebarToggle} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /logout/i }));

    await vi.waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(mockLogout).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith(errorMessage);
    });

    alertSpy.mockRestore();
  });
});
