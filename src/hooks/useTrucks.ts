import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';

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
