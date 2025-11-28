import { describe, expect, it, vi } from 'vitest';

import { Truck } from '@/features/trucks';
import { render, screen } from '@/test/test-utils';

import { Driver } from '../types/Driver';

import { DriversTable } from './DriversTable';

const mockDrivers: Driver[] = [
  { id: '1', name: 'John Doe', phone: '111', cnh: '123', truckId: 'truck1' },
  { id: '2', name: 'Jane Smith', phone: '222', cnh: '456', truckId: null },
];

const mockTrucks = [
  { id: 'truck1', plate: 'ABC-123', model: 'Volvo' },
] as Truck[];

describe('DriversTable', () => {
  it('should render properly', () => {
    render(
      <DriversTable
        drivers={mockDrivers}
        trucks={mockTrucks}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('ABC-123 / Volvo')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const handleEdit = vi.fn();
    const { user } = render(
      <DriversTable
        drivers={mockDrivers}
        trucks={mockTrucks}
        onEdit={handleEdit}
        onDelete={vi.fn()}
      />,
    );

    const editButtons = screen.getAllByTitle('Edit');
    await user.click(editButtons[0]);

    expect(handleEdit).toHaveBeenCalledWith(mockDrivers[0]);
  });

  it('should disable delete button if driver is linked to a truck', () => {
    render(
      <DriversTable
        drivers={mockDrivers}
        trucks={mockTrucks}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const rows = screen.getAllByRole('row');
    const johnsDeleteButton = rows[1].querySelector('button[title="Remove"]');
    const janesDeleteButton = rows[2].querySelector('button[title="Remove"]');

    expect(johnsDeleteButton).toBeDisabled();
    expect(janesDeleteButton).not.toBeDisabled();
  });
});
