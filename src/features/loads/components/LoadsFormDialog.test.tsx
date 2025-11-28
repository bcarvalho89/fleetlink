import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import { Truck, TruckStatus } from '@/features/trucks';
import { render, screen, waitFor } from '@/test/test-utils';

import { LoadSchema } from '../schema/LoadSchema';

import { LoadData, LoadsFormDialog } from './LoadsFormDialog';

const activeTrucks: Truck[] = [
  {
    id: 'truck1',
    driverId: 'driver1',
    driverName: 'John Doe',
    model: 'Volvo',
    plate: 'TRK-001',
    status: TruckStatus.ACTIVE,
  } as Truck,
];

const Wrapper = ({
  onSubmit,
  trucks = activeTrucks,
}: {
  onSubmit: (data: LoadData) => void;
  trucks?: Truck[];
}) => {
  const form = useForm<LoadData>({
    resolver: yupResolver(LoadSchema),
    defaultValues: {
      description: '',
      weight: 0,
      originAddress: '',
      destinationAddress: '',
      truckId: '',
      driverId: '',
    },
  });

  return (
    <LoadsFormDialog
      isOpen={true}
      onClose={vi.fn()}
      onSubmit={onSubmit}
      form={form}
      trucks={trucks}
    />
  );
};

describe('LoadsFormDialog', () => {
  it('should render properly', () => {
    render(<Wrapper onSubmit={vi.fn()} />);

    expect(screen.getByText('Create New Load')).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weight/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/origin address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assign truck/i)).toBeInTheDocument();
  });

  it('should show message and disable submit if no trucks are available', () => {
    render(<Wrapper onSubmit={vi.fn()} trucks={[]} />);

    expect(
      screen.getByText(/no active trucks with drivers available/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create load/i })).toBeDisabled();
  });

  it('should call onSubmit with valid data', async () => {
    const handleSubmit = vi.fn();

    const { user } = render(<Wrapper onSubmit={handleSubmit} />);

    const loadData = {
      description: 'Test Load',
      weight: 1000,
      originAddress: 'Origin',
      destinationAddress: 'Destination',
      truckId: 'truck1',
    };

    await user.type(
      screen.getByLabelText(/description/i),
      loadData.description,
    );
    await user.type(screen.getByLabelText(/weight/i), String(loadData.weight));
    await user.type(
      screen.getByLabelText(/origin address/i),
      loadData.originAddress,
    );
    await user.type(
      screen.getByLabelText(/destination address/i),
      loadData.destinationAddress,
    );
    await user.selectOptions(screen.getByLabelText(/assign truck/i), 'truck1');
    await user.click(screen.getByRole('button', { name: /create load/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          ...loadData,
          driverId: 'driver1',
        }),
        expect.anything(),
      );
    });
  });
});
