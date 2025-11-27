import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import { useThemeStore } from '@/features/theme';

import { ThemeToggle } from './ThemeToggle';

vi.mock('@/features/theme');

const mockedUseThemeStore = useThemeStore as unknown as Mock;

describe('ThemeToggle', () => {
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.classList.remove('dark');
  });

  it('should render with light theme based on store', () => {
    mockedUseThemeStore.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(screen.getByTitle('Change to dark theme')).toBeInTheDocument();
  });

  it('should render with dark theme based on store', () => {
    mockedUseThemeStore.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByTitle('Change to light theme')).toBeInTheDocument();
  });

  it('should call toggleTheme from store on click', () => {
    mockedUseThemeStore.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);
    const toggleButton = screen.getByRole('button');

    fireEvent.click(toggleButton);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
