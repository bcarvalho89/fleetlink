import { render, screen } from '@testing-library/react';
import { Mock, vi } from 'vitest';

import App from './App';
import { useAuth } from './hooks/useAuth';

vi.mock('./hooks/useAuth');

const mockedUseAuth = useAuth as Mock;

describe('App', () => {
  beforeEach(() => {
    mockedUseAuth.mockReset();
  });

  it('renders the dashboard when user is authenticated', () => {
    mockedUseAuth.mockReturnValue(true);

    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Dashboard' }),
    ).toBeInTheDocument();
  });

  it('renders the login page when user is not authenticated', () => {
    mockedUseAuth.mockReturnValue(false);

    render(<App />);

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(
      screen.getByText('This is the login page for FleetLink.'),
    ).toBeInTheDocument();
  });
});
