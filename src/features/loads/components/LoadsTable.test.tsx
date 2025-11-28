import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { Load, LoadStatus } from '../types/Load';

import { LoadsTable } from './LoadsTable';

const mockLoads = [
  {
    id: '1',
    description: 'Test Load 1',
    status: LoadStatus.PLANNED,
    origin: { address: 'City A', lat: 0, lng: 0 },
    destination: { address: 'City B', lat: 0, lng: 0 },
  },
  {
    id: '2',
    description: 'Test Load 2',
    status: LoadStatus.IN_ROUTE,
    origin: { address: 'City C', lat: 0, lng: 0 },
    destination: { address: 'City D', lat: 0, lng: 0 },
  },
] as Load[];

describe('LoadsTable', () => {
  it('should render a message when there are no loads', () => {
    render(
      <LoadsTable
        loads={[]}
        selectedLoad={null}
        setSelectedLoad={vi.fn()}
        handleStatusChange={vi.fn()}
      />,
    );
    expect(screen.getByText('No loads found.')).toBeInTheDocument();
  });

  it('should render load data in table rows', () => {
    render(
      <LoadsTable
        loads={mockLoads}
        selectedLoad={null}
        setSelectedLoad={vi.fn()}
        handleStatusChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Test Load 1')).toBeInTheDocument();
    expect(screen.getByText('Test Load 2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Planned')).toBeInTheDocument();
    expect(screen.getByDisplayValue('In Route')).toBeInTheDocument();
  });

  it('should call setSelectedLoad when a row is clicked', async () => {
    const setSelectedLoad = vi.fn();
    const { user } = render(
      <LoadsTable
        loads={mockLoads}
        selectedLoad={null}
        setSelectedLoad={setSelectedLoad}
        handleStatusChange={vi.fn()}
      />,
    );

    await user.click(screen.getByText('Test Load 1'));

    expect(setSelectedLoad).toHaveBeenCalledWith(mockLoads[0]);
  });
});
