import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test/test-utils';

import LoadsPage from './LoadsPage';
import { LoadStatus } from './types/Load';

const mockLoads = [
  {
    id: '1',
    description: 'Test Load 1',
    status: LoadStatus.PLANNED,
    origin: { address: 'City A', lat: 0, lng: 0 },
    destination: { address: 'City B', lat: 0, lng: 0 },
  },
];

vi.mock('./hooks/useLoads', () => ({
  useLoads: () => ({ data: mockLoads }),
  useLoadMutations: () => ({
    addLoad: { mutateAsync: vi.fn() },
    updateStatus: { mutateAsync: vi.fn() },
  }),
}));

vi.mock('@/features/trucks', async importOriginal => {
  const original = await importOriginal<typeof import('@/features/trucks')>();
  return { ...original, useTrucks: vi.fn(() => ({ data: [] })) };
});

vi.mock('@/components/common/Map', () => ({
  MapComponent: () => <div data-testid="map-component" />,
}));

describe('LoadsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render properly', () => {
    render(<LoadsPage />);

    expect(screen.getByRole('heading', { name: /loads/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /new load/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(
      screen.getByText('Select a load to view the route'),
    ).toBeInTheDocument();
  });

  it('should open the new load dialog when "New Load" is clicked', async () => {
    const { user } = render(<LoadsPage />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /new load/i }));

    expect(
      screen.getByRole('dialog', { name: /create new load/i }),
    ).toBeVisible();
  });

  it('should display the selected load details on the map', async () => {
    const { user } = render(<LoadsPage />);

    expect(screen.getByText('Select a load to view the route')).toBeVisible();

    await user.click(screen.getByText('Test Load 1'));

    expect(
      screen.getByText('Route for: Test Load 1', { exact: false }),
    ).toBeVisible();
    expect(screen.getByTestId('map-component')).toBeVisible();
  });
});
