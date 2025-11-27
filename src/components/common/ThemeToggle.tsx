import { Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';

import { useThemeStore } from '@/features/theme';

import { Button } from '../ui';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const Icon = theme === 'light' ? Sun : Moon;

  return (
    <Button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 rounded-full bg-primary text-primary-foreground shadow-lg"
      aria-label="Toggle theme"
      type="button"
      size="icon"
      title={`Change to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <Icon size={22} />
    </Button>
  );
}
