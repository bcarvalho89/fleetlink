import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  getDocs,
  doc,
  writeBatch,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';
import { Driver } from '@/types';

const COLLECTION = 'drivers';

export function useDrivers() {
  return useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, COLLECTION));
      return snapshot.docs.map(
        doc => ({ id: doc.id, ...doc.data() }) as Driver,
      );
    },
  });
}

export function useDriverMutations() {
  const queryClient = useQueryClient();

  const addDriver = useMutation({
    mutationFn: async (newDriver: Omit<Driver, 'id'>) => {
      const batch = writeBatch(db);

      const driverRef = doc(collection(db, COLLECTION));
      batch.set(driverRef, newDriver);

      if (newDriver.truckId) {
        const truckRef = doc(db, 'trucks', newDriver.truckId);
        batch.update(truckRef, { driverId: driverRef.id });
      }

      await batch.commit();
      return driverRef;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
    },
  });

  const updateDriver = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Driver, 'id'>>;
    }) => {
      const batch = writeBatch(db);
      const driverRef = doc(db, COLLECTION, id);

      const driverSnap = await getDoc(driverRef);
      const oldData = driverSnap.data() as Driver;

      const oldTruckId = oldData.truckId;
      const newTruckId = data.truckId;

      batch.update(driverRef, data);

      if (oldTruckId !== newTruckId) {
        if (oldTruckId) {
          const oldTruckRef = doc(db, 'trucks', oldTruckId);
          batch.update(oldTruckRef, { driverId: null });
        }
        if (newTruckId) {
          const newTruckRef = doc(db, 'trucks', newTruckId);
          batch.update(newTruckRef, { driverId: id });
        }
      }

      await batch.commit();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
    },
  });

  const deleteDriver = useMutation({
    mutationFn: async (id: string) => {
      const docRef = doc(db, COLLECTION, id);

      const driverDoc = await getDoc(docRef);
      if (driverDoc.exists()) {
        const driverData = driverDoc.data() as Driver;

        if (driverData.truckId) {
          throw new Error(
            'You cannot delete a driver that is linked to a truck.',
          );
        }
      }

      return deleteDoc(doc(db, COLLECTION, id));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['drivers'] }),
  });

  return { addDriver, updateDriver, deleteDriver };
}
