import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { useDrivers } from '@/features/drivers';
import { LoadStatus, useLoads } from '@/features/loads';
import { useAvailableTrucks } from '@/features/trucks';
import { render, screen, waitFor, within } from '@/test/test-utils';

import DashboardPage from './DashboardPage';

vi.mock('@/features/loads', async importOriginal => {
  const original = await importOriginal<typeof import('@/features/loads')>();
  return { ...original, useLoads: vi.fn() };
});

vi.mock('@/features/trucks', async importOriginal => {
  const original = await importOriginal<typeof import('@/features/trucks')>();
  return { ...original, useAvailableTrucks: vi.fn() };
});

vi.mock('@/features/drivers', async importOriginal => {
  const original = await importOriginal<typeof import('@/features/drivers')>();
  return { ...original, useDrivers: vi.fn() };
});

const mockLoads = [
  {
    id: '1',
    status: LoadStatus.IN_ROUTE,
    description: 'In Route Load',
    origin: { address: 'A' },
    destination: { address: 'B' },
    createdAt: 1,
  },
  {
    id: '2',
    status: LoadStatus.PLANNED,
    description: 'Planned Load',
    origin: { address: 'C' },
    destination: { address: 'D' },
    createdAt: 2,
  },
  {
    id: '3',
    status: LoadStatus.DELIVERED,
    description: 'Delivered Load 1',
    origin: { address: 'E' },
    destination: { address: 'F' },
    createdAt: 0,
  },
  {
    id: '4',
    status: LoadStatus.DELIVERED,
    description: 'Delivered Load 2',
    origin: { address: 'G' },
    destination: { address: 'H' },
  },
];

describe('DashboardPage', () => {
  beforeEach(() => {
    (useLoads as Mock).mockReturnValue({
      data: mockLoads,
    });
    (useAvailableTrucks as Mock).mockReturnValue({ data: [{}, {}] });
    (useDrivers as Mock).mockReturnValue({ data: [{}, {}, {}] });
  });

  it('should render properly', async () => {
    render(<DashboardPage />, { wrapper: MemoryRouter });

    await waitFor(() => {
      const inRouteCard = screen
        .getByText('Loads In Route')
        .closest('div[class*="card"]');
      expect(
        within(inRouteCard as HTMLElement).getByText('1'),
      ).toBeInTheDocument();

      const plannedCard = screen
        .getByText('Planned Loads')
        .closest('div[class*="card"]');
      expect(
        within(plannedCard as HTMLElement).getByText('1'),
      ).toBeInTheDocument();

      const deliveredCard = screen
        .getByText('Delivered Loads')
        .closest('div[class*="card"]');
      expect(
        within(deliveredCard as HTMLElement).getByText('2'),
      ).toBeInTheDocument();

      const availableTrucksCard = screen
        .getByText('Available Trucks')
        .closest('div[class*="card"]');
      expect(
        within(availableTrucksCard as HTMLElement).getByText('2'),
      ).toBeInTheDocument();

      const totalDriversCard = screen
        .getByText('Total Drivers')
        .closest('div[class*="card"]');
      expect(
        within(totalDriversCard as HTMLElement).getByText('3'),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Recent Loads')).toBeInTheDocument();
      expect(screen.getByText('Planned Load')).toBeInTheDocument();
      expect(screen.getByText('In Route Load')).toBeInTheDocument();
    });
  });
});
