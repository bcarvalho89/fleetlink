import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { storage } from '@/lib/firebase';
import { render, screen, waitFor } from '@/test/test-utils';

import TrucksPage from './TrucksPage';

vi.mock('@/lib/firebase', () => ({
  storage: vi.fn(),
}));

vi.mock('./hooks/useTrucks', () => ({
  useTrucks: () => ({ data: [] }),
  useTruckMutations: () => ({
    addTruck: { mutateAsync: vi.fn() },
    updateTruck: { mutateAsync: vi.fn() },
    deleteTruck: { mutateAsync: vi.fn(), isPending: false },
  }),
}));

describe('TrucksPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the trucks page with a table and a "New Truck" button', () => {
    render(<TrucksPage />);

    expect(
      screen.getByRole('heading', { name: /trucks/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /new truck/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should open the truck form dialog when "New Truck" is clicked', async () => {
    const { user } = render(<TrucksPage />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /new truck/i }));

    expect(
      screen.getByRole('dialog', { name: /register truck/i }),
    ).toBeVisible();
  });

  it('should handle file upload', async () => {
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const mockUrl = 'http://example.com/hello.png';
    (storage as Mock).mockResolvedValue(mockUrl);

    const { user } = render(<TrucksPage />);

    await user.click(screen.getByRole('button', { name: /new truck/i }));

    const fileInput = screen.getByLabelText(/document/i);
    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(storage).toHaveBeenCalledWith(file);
    });
  });
});
