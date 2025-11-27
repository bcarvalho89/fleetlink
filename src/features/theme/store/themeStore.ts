import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  sidebarExpanded: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

export const useThemeStore = create(
  persist<ThemeState>(
    set => ({
      theme: 'light',
      sidebarExpanded: false,
      toggleTheme: () =>
        set(state => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      toggleSidebar: () =>
        set(state => ({ sidebarExpanded: !state.sidebarExpanded })),
    }),
    {
      name: 'theme',
    },
  ),
);
