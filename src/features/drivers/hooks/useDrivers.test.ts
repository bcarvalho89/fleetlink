import { waitFor } from '@testing-library/react';
import {
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { Mock, afterEach, describe, expect, it, vi } from 'vitest';

import { renderHook } from '@/test/test-utils';

import { Driver } from '../types/Driver';

import { useDriverMutations, useDrivers } from './useDrivers';

describe('useDrivers', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and set drivers data on snapshot update', async () => {
    const mockDrivers = [{ id: '1', name: 'John Doe' }];
    (onSnapshot as Mock).mockImplementation((_, callback) => {
      callback({
        docs: mockDrivers.map(d => ({
          id: d.id,
          data: () => ({ name: d.name }),
        })),
      });

      return vi.fn();
    });

    const { result } = renderHook(() => useDrivers());

    await waitFor(() => {
      expect(result.current.data).toEqual(mockDrivers);
    });
  });
});

describe('useDriverMutations', () => {
  let batchMock: {
    set: Mock;
    update: Mock;
    commit: Mock;
  };

  beforeEach(() => {
    batchMock = {
      set: vi.fn(),
      update: vi.fn(),
      commit: vi.fn().mockResolvedValue(undefined),
    };
    (writeBatch as Mock).mockReturnValue(batchMock);
    (doc as Mock).mockImplementation((_, path) => ({ path }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('addDriver should call firestore set and commit', async () => {
    const { result } = renderHook(() => useDriverMutations());
    const newDriver = { name: 'Jane Doe', phone: '123', cnh: '456' } as Driver;

    await result.current.addDriver.mutateAsync(newDriver);

    expect(writeBatch).toHaveBeenCalled();
    expect(batchMock.set).toHaveBeenCalled();
    expect(batchMock.commit).toHaveBeenCalled();
  });

  it('updateDriver should call firestore update and commit', async () => {
    (getDoc as Mock).mockResolvedValue({ data: () => ({ truckId: null }) });
    const { result } = renderHook(() => useDriverMutations());
    const driverUpdate = { id: '1', data: { name: 'Jane Doe Updated' } };

    await result.current.updateDriver.mutateAsync(driverUpdate);

    expect(writeBatch).toHaveBeenCalled();
    expect(batchMock.update).toHaveBeenCalled();
    expect(batchMock.commit).toHaveBeenCalled();
  });

  it('deleteDriver should call firestore deleteDoc', async () => {
    (getDoc as Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({}),
    });
    const { result } = renderHook(() => useDriverMutations());

    await result.current.deleteDriver.mutateAsync('1');

    expect(deleteDoc).toHaveBeenCalled();
  });
});
