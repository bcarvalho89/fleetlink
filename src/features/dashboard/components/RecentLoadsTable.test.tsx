import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { Load, LoadStatus } from '@/features/loads';
import { render, screen } from '@/test/test-utils';

import { RecentLoadsTable } from './RecentLoadsTable';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockLoads: Load[] = [
  {
    id: '1',
    description: 'Test Load 1',
    status: LoadStatus.PLANNED,
    origin: { address: 'City A' },
    destination: { address: 'City B' },
  } as Load,
];

describe('RecentLoadsTable', () => {
  it('should render "No loads" message when there are no loads', () => {
    render(
      <MemoryRouter>
        <RecentLoadsTable loads={[]} />
      </MemoryRouter>,
    );

    expect(screen.getByText('No loads created yet.')).toBeInTheDocument();
  });

  it('should render loads data in table rows', () => {
    render(
      <MemoryRouter>
        <RecentLoadsTable loads={mockLoads} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Test Load 1')).toBeInTheDocument();
    expect(screen.getByText('City A')).toBeInTheDocument();
    expect(screen.getByText('to City B')).toBeInTheDocument();
    expect(screen.getByText('Planned')).toBeInTheDocument();
  });

  it('should navigate to loads page when "View Details" is clicked', async () => {
    const { user } = render(<RecentLoadsTable loads={mockLoads} />, {
      wrapper: MemoryRouter,
    });

    await user.click(screen.getByRole('button', { name: /view details/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/loads');
  });
});
