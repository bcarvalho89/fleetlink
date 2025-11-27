import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { useEffect } from 'react';
import * as yup from 'yup';

import { db } from '@/lib/firebase';

import { LoadSchema } from '../schema/LoadSchema';
import { Load, LoadStatus } from '../types/Load';

const COLLECTION = 'loads';

export function useLoads() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const q = query(collection(db, COLLECTION));

    const unsubscribe = onSnapshot(q, snapshot => {
      const loads = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Load[];

      queryClient.setQueryData(['loads'], loads);
    });

    return () => unsubscribe();
  }, [queryClient]);

  return useQuery<Load[]>({
    queryKey: ['loads'],
    queryFn: () => [],
    enabled: false,
    initialData: [],
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
