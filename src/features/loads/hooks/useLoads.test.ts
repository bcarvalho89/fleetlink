import { waitFor } from '@testing-library/react';
import { addDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Mock, afterEach, describe, expect, it, vi } from 'vitest';

import { renderHook } from '@/test/test-utils';

import { LoadStatus } from '../types/Load';

import { useLoadMutations, useLoads } from './useLoads';

describe('useLoads', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and set loads data on snapshot update', async () => {
    const mockLoads = [{ id: '1', description: 'Test Load' }];
    (onSnapshot as Mock).mockImplementation((_, callback) => {
      callback({
        docs: mockLoads.map(d => ({ id: d.id, data: () => d })),
      });

      return vi.fn();
    });

    const { result } = renderHook(() => useLoads());

    await waitFor(() => {
      expect(result.current.data).toEqual(mockLoads);
    });
  });
});

describe('useLoadMutations', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('addLoad should call firestore addDoc', async () => {
    const { result } = renderHook(() => useLoadMutations());
    const newLoad = {
      description: 'New Load',
      originAddress: 'Origin',
      destinationAddress: 'Destination',
      weight: 100,
      truckId: 'truck1',
      driverId: 'driver1',
      status: LoadStatus.PLANNED,
      createdAt: Date.now(),
      origin: {
        lat: -23.55,
        lng: -46.63,
        address: 'Origin',
      },
      destination: {
        lat: -23.55,
        lng: -46.63,
        address: 'Destination',
      },
      id: '1',
    };

    await result.current.addLoad.mutateAsync(newLoad);

    expect(addDoc).toHaveBeenCalled();
  });

  it('updateStatus should call firestore updateDoc', async () => {
    const { result } = renderHook(() => useLoadMutations());
    const statusUpdate = { id: '1', status: 'IN_TRANSIT' };

    await result.current.updateStatus.mutateAsync(statusUpdate);

    expect(updateDoc).toHaveBeenCalled();
  });
});
