import { waitFor } from '@testing-library/react';
import {
  DocumentData,
  QuerySnapshot,
  QueryDocumentSnapshot,
  onSnapshot,
  addDoc,
  updateDoc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

import { renderHook } from '@/test/test-utils';

import { TruckStatus } from '../types/Truck';

import { useAvailableTrucks, useTruckMutations, useTrucks } from './useTrucks';

type SnapshotCallback = (
  snapshot: Partial<QuerySnapshot<DocumentData, DocumentData>>,
) => void;

type Unsubscribe = () => void;

type Docs = QueryDocumentSnapshot<DocumentData, DocumentData>[];

describe('useTrucks', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch trucks and map driver names on snapshot update', async () => {
    const mockDrivers = [{ id: 'driver1', name: 'John Doe' }];
    const mockTrucks = [{ id: 'truck1', model: 'Volvo', driverId: 'driver1' }];

    const mockDriverDocs = mockDrivers.map(d => ({
      id: d.id,
      data: () => ({ name: d.name }),
    }));
    let driversCallback: (
      snapshot: Partial<QuerySnapshot<DocumentData>>,
    ) => void = vi.fn();
    let callCount = 0;

    (onSnapshot as Mock).mockImplementation(
      (_query, callback: SnapshotCallback): Unsubscribe => {
        callCount++;

        if (callCount === 1) {
          const trucksCallback = callback;

          trucksCallback({
            docs: mockTrucks.map(t => ({
              id: t.id,
              data: () => t,
            })) as unknown as Docs,
          });
        } else if (callCount === 2) {
          driversCallback = callback;
          driversCallback({
            docs: mockDriverDocs.map(
              d => d as unknown as QueryDocumentSnapshot<DocumentData>,
            ),
            forEach: (cb: (doc: QueryDocumentSnapshot<DocumentData>) => void) =>
              mockDriverDocs.forEach(d =>
                cb(d as unknown as QueryDocumentSnapshot<DocumentData>),
              ),
          });
        }

        return vi.fn();
      },
    );

    const { result } = renderHook(() => useTrucks());

    await waitFor(() => {
      expect(result.current.data).toHaveLength(1);
      expect(result.current.data?.[0].driverName).toBe('John Doe');
    });
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
