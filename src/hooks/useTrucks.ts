import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';
import { Truck } from '@/types';

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
      return updateDoc(docRef, data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trucks'] }),
  });

  return { addTruck, updateTruck };
}
