import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { Truck, TruckStatus } from '../types/Truck';

import { TrucksTable } from './TrucksTable';

const mockTrucks: Truck[] = [
  {
    id: '1',
    plate: 'TRK-001',
    model: 'Volvo',
    status: TruckStatus.ACTIVE,
    driverId: 'driver1',
    driverName: 'John Doe',
    capacity: 20000,
    year: 2022,
    docUrl: 'https://example.com/doc.pdf',
  },
  {
    id: '2',
    plate: 'TRK-002',
    model: 'Scania',
    status: TruckStatus.MAINTENANCE,
    driverId: null,
    capacity: 30000,
    year: 2021,
    docUrl: 'https://example.com/doc2.pdf',
  },
];

describe('TrucksTable', () => {
  it('should render properly', () => {
    render(
      <TrucksTable trucks={mockTrucks} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByText('TRK-001')).toBeInTheDocument();
    expect(screen.getByText('Volvo')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    expect(screen.getByText('TRK-002')).toBeInTheDocument();
    expect(screen.getByText('Scania')).toBeInTheDocument();
    expect(screen.getByText('Maintenance')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const handleEdit = vi.fn();
    const { user } = render(
      <TrucksTable
        trucks={mockTrucks}
        onEdit={handleEdit}
        onDelete={vi.fn()}
      />,
    );

    const editButtons = screen.getAllByTitle('Edit');
    await user.click(editButtons[0]);

    expect(handleEdit).toHaveBeenCalledWith('1');
  });

  it('should disable delete button if truck is linked to a driver', () => {
    render(
      <TrucksTable trucks={mockTrucks} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    const rows = screen.getAllByRole('row');
    const truck1DeleteButton = rows[1].querySelector('button[title="Remove"]');
    const truck2DeleteButton = rows[2].querySelector('button[title="Remove"]');

    expect(truck1DeleteButton).toBeDisabled();
    expect(truck2DeleteButton).not.toBeDisabled();
  });
});
