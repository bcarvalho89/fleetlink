import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test/test-utils';

import DriversPage from './DriversPage';

vi.mock('./hooks/useDrivers', () => ({
  useDrivers: () => ({ data: [] }),
  useDriverMutations: () => ({
    addDriver: { mutateAsync: vi.fn() },
    updateDriver: { mutateAsync: vi.fn() },
    deleteDriver: { mutateAsync: vi.fn(), isPending: false },
  }),
}));

vi.mock('@/features/trucks', () => ({
  useAvailableTrucks: () => ({ data: [] }),
  useTrucks: () => ({ data: [] }),
}));

describe('DriversPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render properly', () => {
    render(<DriversPage />);

    expect(
      screen.getByRole('heading', { name: /drivers/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /new driver/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should open the driver form dialog when "New Driver" is clicked', async () => {
    const { user } = render(<DriversPage />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /new driver/i }));

    expect(
      screen.getByRole('dialog', { name: /register driver/i }),
    ).toBeVisible();
  });
});
