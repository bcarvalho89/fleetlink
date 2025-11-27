import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { useEffect } from 'react';

import { db } from '@/lib/firebase';

import { Truck, TruckStatus } from '../types/Truck';

const COLLECTION = 'trucks';

export function useTrucks() {
  return useQuery({
    queryKey: ['trucks'],
    queryFn: async () => {
      const driversSnapshot = await getDocs(collection(db, 'drivers'));
      const driversMap = new Map<string, string>();
      driversSnapshot.forEach(doc => {
        driversMap.set(doc.id, doc.data().name);
      });

      const trucksSnapshot = await getDocs(collection(db, COLLECTION));

      return trucksSnapshot.docs.map(doc => {
        const truckData = { id: doc.id, ...doc.data() } as Truck;

        truckData.driverName = truckData.driverId
          ? driversMap.get(truckData.driverId)
          : undefined;

        return truckData;
      });
    },
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
