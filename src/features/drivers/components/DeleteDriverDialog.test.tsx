import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { DeleteDriverDialog } from './DeleteDriverDialog';

describe('DeleteDriverDialog', () => {
  it('should render properly', () => {
    render(
      <DeleteDriverDialog
        isOpen={true}
        onClose={vi.fn()}
        onDelete={vi.fn()}
        isDeleting={false}
      />,
    );

    expect(
      screen.getByRole('dialog', { name: /confirm deletion/i }),
    ).toBeVisible();
    expect(
      screen.getByText(/are you sure you want to delete this driver/i),
    ).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', async () => {
    const handleDelete = vi.fn();
    const { user } = render(
      <DeleteDriverDialog
        isOpen={true}
        onClose={vi.fn()}
        onDelete={handleDelete}
        isDeleting={false}
      />,
    );

    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  it('should show loading state when isDeleting is true', () => {
    render(
      <DeleteDriverDialog
        isOpen={true}
        onClose={vi.fn()}
        onDelete={vi.fn()}
        isDeleting={true}
      />,
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeDisabled();
    expect(deleteButton.querySelector('svg')).toBeInTheDocument();
  });
});
