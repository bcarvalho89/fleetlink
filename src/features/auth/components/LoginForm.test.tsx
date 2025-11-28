import { describe, expect, it, vi } from 'vitest';

import { render, screen, waitFor } from '@/test/test-utils';

import { LoginForm, LoginData } from './LoginForm';

describe('LoginForm', () => {
  it('should render properly', () => {
    const handleSubmit = vi.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('should display validation errors for empty fields on submit', async () => {
    const handleSubmit = vi.fn();
    const { user } = render(<LoginForm onSubmit={handleSubmit} />);

    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    await user.click(submitButton);

    expect(await screen.findByText('Email is required')).toBeVisible();
    expect(await screen.findByText('Password is required')).toBeVisible();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with form data when form is valid', async () => {
    const handleSubmit = vi.fn();
    const { user } = render(<LoginForm onSubmit={handleSubmit} />);

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    const loginData: LoginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    await user.type(emailInput, loginData.email);
    await user.type(passwordInput, loginData.password);
    await user.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(loginData, expect.anything());
    });
  });
});
