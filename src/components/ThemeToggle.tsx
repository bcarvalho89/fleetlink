import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from './ui';

export function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') ?? 'light');

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

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
