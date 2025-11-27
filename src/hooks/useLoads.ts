import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import * as yup from 'yup';

import { db } from '@/lib/firebase';
import { LoadSchema } from '@/schemas/LoadSchema';
import { Load, LoadStatus } from '@/types';

const COLLECTION = 'loads';

export function useLoads() {
  return useQuery({
    queryKey: ['loads'],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, COLLECTION));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Load);
    },
  });
}

const getGeoCode = async (address: string) => {
  // Returns random coords near São Paulo for demo purposes
  const baseLat = -23.55;
  const baseLng = -46.63;
  return {
    lat: baseLat + (Math.random() - 0.5) * 0.5,
    lng: baseLng + (Math.random() - 0.5) * 0.5,
    address,
  };
};

type LoadData = yup.InferType<typeof LoadSchema>;

export function useLoadMutations() {
  const queryClient = useQueryClient();

  const addLoad = useMutation({
    mutationFn: async (data: LoadData) => {
      const origin = await getGeoCode(data.originAddress);
      const destination = await getGeoCode(data.destinationAddress);

      const newLoad = {
        description: data.description,
        weight: data.weight,
        status: LoadStatus.PLANNED,
        truckId: data.truckId,
        driverId: data.driverId,
        origin,
        destination,
        createdAt: Date.now(),
      };

      return addDoc(collection(db, COLLECTION), newLoad);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['loads'] }),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const ref = doc(db, COLLECTION, id);
      return updateDoc(ref, { status });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['loads'] }),
  });

  return { addLoad, updateStatus };
}
