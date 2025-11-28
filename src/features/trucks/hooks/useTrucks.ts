import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { useEffect } from 'react';

import { Driver } from '@/features/drivers/types/Driver';
import { db } from '@/lib/firebase';

import { Truck, TruckStatus } from '../types/Truck';

const COLLECTION = 'trucks';

export function useTrucks() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const trucksQuery = query(collection(db, COLLECTION));
    const driversQuery = query(collection(db, 'drivers'));

    const unsubTrucks = onSnapshot(trucksQuery, trucksSnapshot => {
      const trucks = trucksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Truck[];

      const unsubDrivers = onSnapshot(driversQuery, driversSnapshot => {
        const driversMap = new Map<string, string>();
        driversSnapshot.forEach(doc => {
          const driver = doc.data() as Omit<Driver, 'id'>;
          driversMap.set(doc.id, driver.name);
        });

        const trucksWithDriverNames = trucks.map(truck => ({
          ...truck,
          driverName: truck.driverId
            ? driversMap.get(truck.driverId)
            : undefined,
        }));

        queryClient.setQueryData(['trucks'], trucksWithDriverNames);
      });

      return () => unsubDrivers();
    });

    return () => unsubTrucks();
  }, [queryClient]);

  return useQuery<Truck[]>({
    queryKey: ['trucks'],
    queryFn: () => [],
    enabled: false,
    initialData: [],
  });
}

export function useAvailableTrucks() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const q = query(
      collection(db, COLLECTION),
      where('driverId', '==', null),
      where('status', '==', TruckStatus.ACTIVE),
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const trucks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Truck[];

      queryClient.setQueryData(['trucks', 'available'], trucks);
    });

    return () => unsubscribe();
  }, [queryClient]);

  return useQuery<Truck[]>({
    queryKey: ['trucks', 'available'],
    queryFn: () => [],
    enabled: false,
    initialData: [],
  });
}

export function useTruckMutations() {
  const queryClient = useQueryClient();

  const addTruck = useMutation({
    mutationFn: async (newTruck: Omit<Truck, 'id'>) => {
      return addDoc(collection(db, COLLECTION), newTruck);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trucks'] }),
  });

  const updateTruck = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Truck> }) => {
      const docRef = doc(db, COLLECTION, id);

      delete data.driverName;

      return updateDoc(docRef, data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trucks'] }),
  });

  const deleteTruck = useMutation({
    mutationFn: async (id: string) => {
      const docRef = doc(db, COLLECTION, id);

      const truckDoc = await getDoc(docRef);
      if (truckDoc.exists()) {
        const truckData = truckDoc.data() as Truck;
        if (truckData.docUrl) {
          // do anything since we are mocking the storage
        }

        if (truckData.driverId) {
          throw new Error(
            'You cannot delete a truck that is linked to a driver.',
          );
        }
      }

      return deleteDoc(docRef);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trucks'] }),
  });

  return { addTruck, updateTruck, deleteTruck };
}
