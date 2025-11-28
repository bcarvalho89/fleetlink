import { act, renderHook } from '@testing-library/react';
import { User } from 'firebase/auth';
import { afterEach, describe, expect, it } from 'vitest';

import { useAuthStore } from './authStore';

describe('useAuthStore', () => {
  afterEach(() => {
    // Reset store state after each test
    act(() => {
      useAuthStore.getState().logout();
    });
  });

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should handle login action', () => {
    const { result } = renderHook(() => useAuthStore());
    const user = { uid: '123', email: 'test@example.com' };

    act(() => {
      result.current.login(user);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(user);
  });

  it('should handle logout action', () => {
    const { result } = renderHook(() => useAuthStore());

    // First, log in
    act(() => {
      result.current.login({ uid: '123', email: 'test@example.com' });
    });

    // Then, log out
    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should handle setUser action', () => {
    const { result } = renderHook(() => useAuthStore());
    const firebaseUser = { uid: '456', email: 'firebase@example.com' } as User;

    act(() => {
      result.current.setUser(firebaseUser);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({
      uid: '456',
      email: 'firebase@example.com',
    });
  });
});
