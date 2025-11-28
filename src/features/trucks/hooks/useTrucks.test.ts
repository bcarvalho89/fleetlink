import { waitFor } from '@testing-library/react';
import {
  addDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { Mock, afterEach, describe, expect, it, vi } from 'vitest';

import { renderHook } from '@/test/test-utils';

import { TruckStatus } from '../types/Truck';

import { useAvailableTrucks, useTruckMutations, useTrucks } from './useTrucks';

describe('useTrucks', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch trucks and map driver names', async () => {
    (getDocs as Mock)
      .mockResolvedValueOnce({
        forEach: vi.fn(callback =>
          [{ id: 'driver1', data: () => ({ name: 'John Doe' }) }].forEach(doc =>
            callback(doc),
          ),
        ),
        docs: [{ id: 'driver1', data: () => ({ name: 'John Doe' }) }],
      })
      .mockResolvedValueOnce({
        docs: [
          {
            id: 'truck1',
            data: () => ({ model: 'Volvo', driverId: 'driver1' }),
          },
        ],
      });

    const { result } = renderHook(() => useTrucks());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      {
        id: 'truck1',
        model: 'Volvo',
        driverId: 'driver1',
        driverName: 'John Doe',
      },
    ]);
  });
});

describe('useAvailableTrucks', () => {
  it('should fetch and set available trucks data on snapshot update', async () => {
    const mockTrucks = [{ id: '1', model: 'Scania' }];
    (onSnapshot as Mock).mockImplementation((_, callback) => {
      callback({ docs: mockTrucks.map(t => ({ id: t.id, data: () => t })) });
      return vi.fn();
    });

    const { result } = renderHook(() => useAvailableTrucks());

    await waitFor(() => {
      expect(result.current.data).toEqual(mockTrucks);
    });
  });
});

describe('useTruckMutations', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('addTruck should call firestore addDoc', async () => {
    const { result } = renderHook(() => useTruckMutations());
    const newTruck = {
      model: 'MAN',
      capacity: 20,
      docUrl: 'fakepath',
      status: TruckStatus.ACTIVE,
      driverId: null,
      id: '1',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      plate: 'ABC123',
      year: 2020,
    };

    await result.current.addTruck.mutateAsync(newTruck);
    expect(addDoc).toHaveBeenCalled();
  });

  it('updateTruck should call firestore updateDoc', async () => {
    const { result } = renderHook(() => useTruckMutations());
    await result.current.updateTruck.mutateAsync({ id: '1', data: {} });
    expect(updateDoc).toHaveBeenCalled();
  });

  it('deleteTruck should call firestore deleteDoc', async () => {
    (getDoc as Mock).mockResolvedValue({ exists: () => false });
    const { result } = renderHook(() => useTruckMutations());
    await result.current.deleteTruck.mutateAsync('1');
    expect(deleteDoc).toHaveBeenCalled();
  });
});
