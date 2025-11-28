import { act } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { renderHook } from '@/test/test-utils';

import { useThemeStore } from './themeStore';

describe('useThemeStore', () => {
  afterEach(() => {
    act(() => {
      useThemeStore.setState({ theme: 'light', sidebarExpanded: false });
    });
  });

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useThemeStore());

    expect(result.current.theme).toBe('light');
    expect(result.current.sidebarExpanded).toBe(false);
  });

  it('should toggle theme from light to dark', () => {
    const { result } = renderHook(() => useThemeStore());

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('dark');
  });

  it('should toggle sidebar from collapsed to expanded', () => {
    const { result } = renderHook(() => useThemeStore());
    act(() => {
      result.current.toggleSidebar();
    });
    expect(result.current.sidebarExpanded).toBe(true);
  });

  it('should toggle sidebar from expanded to collapsed', () => {
    act(() => useThemeStore.setState({ sidebarExpanded: true }));
    const { result } = renderHook(() => useThemeStore());
    act(() => result.current.toggleSidebar());
    expect(result.current.sidebarExpanded).toBe(false);
  });
});
