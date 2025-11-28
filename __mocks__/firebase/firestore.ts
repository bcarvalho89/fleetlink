// __mocks__/firebase/firestore.ts
import { vi } from 'vitest';

export const getFirestore = vi.fn(() => ({}));
export const writeBatch = vi.fn();

export const collection = vi.fn((_, collectionId) => collectionId);
export const doc = vi.fn((_, collectionId, docId) => ({ collectionId, docId }));
export const query = vi.fn(q => q);
export const where = vi.fn((field, op, value) => ({ field, op, value }));

export const getDocs = vi.fn(() => Promise.resolve({}));
export const addDoc = vi.fn(() => Promise.resolve({ id: 'mock-id' }));
export const updateDoc = vi.fn(() => Promise.resolve());
export const deleteDoc = vi.fn(() => Promise.resolve());
export const getDoc = vi.fn(() =>
  Promise.resolve({ exists: () => false, data: () => ({}) }),
);

export const onSnapshot = vi.fn((q, callback) => {
  callback({ docs: [] });

  return vi.fn();
});
