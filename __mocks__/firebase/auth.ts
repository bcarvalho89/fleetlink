// __mocks__/firebase/auth.ts
import { vi } from 'vitest';

export const getAuth = vi.fn(() => ({}));
export const signOut = vi.fn(() => ({}));
export const signInWithEmailAndPassword = vi.fn(() => ({}));
