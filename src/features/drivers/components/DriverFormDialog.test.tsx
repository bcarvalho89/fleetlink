import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import { Truck } from '@/features/trucks';
import { render, screen, waitFor } from '@/test/test-utils';

import { DriverSchema } from '../schemas/DriverSchema';

import { DriverData, DriverFormDialog } from './DriverFormDialog';

const Wrapper = ({
  onSubmit,
  editingDriverId = null,
}: {
  onSubmit: (data: DriverData) => void;
  editingDriverId?: string | null;
}) => {
  const form = useForm<DriverData>({
    resolver: yupResolver(DriverSchema),
    defaultValues: {
      name: '',
      phone: '',
      cnh: '',
      truckId: '',
    },
  });

  return (
    <DriverFormDialog
      isOpen={true}
      onClose={vi.fn()}
      onSubmit={onSubmit}
      editingDriverId={editingDriverId}
      form={form}
      truckOptions={[
        { id: 'truck1', plate: 'TRK-123', model: 'Volvo' } as Truck,
      ]}
    />
  );
};

describe('DriverFormDialog', () => {
  it('should render with "Register Driver" title when creating', () => {
    render(<Wrapper onSubmit={vi.fn()} />);

    expect(screen.getByText('Register Driver')).toBeInTheDocument();
  });

  it('should render with "Edit Driver" title when editing', () => {
    render(<Wrapper onSubmit={vi.fn()} editingDriverId="driver1" />);

    expect(screen.getByText('Edit Driver')).toBeInTheDocument();
  });

  it('should show validation errors on submit with empty data', async () => {
    const handleSubmit = vi.fn();
    const { user } = render(<Wrapper onSubmit={handleSubmit} />);

    await user.click(screen.getByRole('button', { name: /save driver/i }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(await screen.findByText('Phone is required')).toBeInTheDocument();
    expect(
      await screen.findByText('Driver License (CNH) is required'),
    ).toBeInTheDocument();

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with form data when form is valid', async () => {
    const handleSubmit = vi.fn();
    const { user } = render(<Wrapper onSubmit={handleSubmit} />);

    const driverData: DriverData = {
      name: 'John Doe',
      phone: '555-555-5555',
      cnh: '12345678900',
      truckId: 'truck1',
    };

    await user.type(screen.getByLabelText(/name/i), driverData.name);
    await user.type(screen.getByLabelText(/phone/i), driverData.phone);
    await user.type(screen.getByLabelText(/cnh/i), driverData.cnh);
    await user.selectOptions(screen.getByLabelText(/link to truck/i), 'truck1');
    await user.click(screen.getByRole('button', { name: /save driver/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(driverData, expect.anything());
    });
  });
});
