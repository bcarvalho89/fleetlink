// __mocks__/firebase/app.ts
import { vi } from 'vitest';

const mockApp = { name: 'mock-app' };

export const initializeApp = vi.fn(() => mockApp);
export const getApps = vi.fn(() => [mockApp]);
export const getApp = vi.fn(() => mockApp);
