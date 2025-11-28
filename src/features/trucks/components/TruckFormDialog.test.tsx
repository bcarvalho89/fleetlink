import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import { render, screen, waitFor } from '@/test/test-utils';

import { TruckSchema } from '../schemas/TruckSchema';
import { TruckStatus } from '../types/Truck';

import { TruckData, TruckFormDialog } from './TruckFormDialog';

const Wrapper = ({
  onSubmit,
  editingTruckId = null,
  isUploading = false,
}: {
  onSubmit: (data: TruckData) => void;
  editingTruckId?: string | null;
  isUploading?: boolean;
}) => {
  const form = useForm<TruckData>({
    resolver: yupResolver(TruckSchema),
    defaultValues: {
      plate: '',
      model: '',
      capacity: 0,
      year: new Date().getFullYear(),
      status: TruckStatus.ACTIVE,
      docUrl: '',
    },
  });

  return (
    <TruckFormDialog
      isOpen={true}
      onClose={vi.fn()}
      onSubmit={onSubmit}
      editingTruckId={editingTruckId}
      form={form}
      onFileUpload={vi.fn()}
      isUploading={isUploading}
    />
  );
};

describe('TruckFormDialog', () => {
  it('should render with "Register Truck" title when creating', () => {
    render(<Wrapper onSubmit={vi.fn()} />);
    expect(screen.getByText('Register Truck')).toBeInTheDocument();
  });

  it('should render with "Edit Truck" title when editing', () => {
    render(<Wrapper onSubmit={vi.fn()} editingTruckId="truck1" />);

    expect(screen.getByText('Edit Truck')).toBeInTheDocument();
  });

  it('should show validation errors on submit with empty data', async () => {
    const handleSubmit = vi.fn();
    const { user } = render(<Wrapper onSubmit={handleSubmit} />);

    await user.click(screen.getByRole('button', { name: /save truck/i }));

    expect(
      await screen.findByText('License plate is required'),
    ).toBeInTheDocument();
    expect(await screen.findByText('Model is required')).toBeInTheDocument();
    expect(await screen.findByText('Must be positive')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with form data when form is valid', async () => {
    const handleSubmit = vi.fn();
    const { user } = render(<Wrapper onSubmit={handleSubmit} />);

    const truckData = {
      plate: 'ABC-1234',
      model: 'Volvo FH16',
      capacity: 20000,
      year: 2022,
      status: TruckStatus.ACTIVE,
    };

    await user.type(screen.getByLabelText(/plate/i), truckData.plate);
    await user.type(screen.getByLabelText(/model/i), truckData.model);
    await user.clear(screen.getByLabelText(/capacity/i));
    await user.type(
      screen.getByLabelText(/capacity/i),
      String(truckData.capacity),
    );
    await user.clear(screen.getByLabelText(/year/i));
    await user.type(screen.getByLabelText(/year/i), String(truckData.year));
    await user.click(screen.getByRole('button', { name: /save truck/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining(truckData),
        expect.anything(),
      );
    });
  });

  it('should show uploading indicator when isUploading is true', () => {
    render(<Wrapper onSubmit={vi.fn()} isUploading={true} />);

    expect(screen.getByText('Uploading...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save truck/i })).toBeDisabled();
  });
});
