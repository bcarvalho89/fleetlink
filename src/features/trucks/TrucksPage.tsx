import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui';
import { storage } from '@/lib/firebase';

import { DeleteTruckDialog } from './components/DeleteTruckDialog';
import { TruckData, TruckFormDialog } from './components/TruckFormDialog';
import { TrucksTable } from './components/TrucksTable';
import { useTruckMutations, useTrucks } from './hooks/useTrucks';
import { TruckSchema } from './schemas/TruckSchema';

export default function TrucksPage() {
  const [isTruckFormOpen, setIsTruckFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingTruckId, setEditingTruckId] = useState<string | null>(null);
  const [truckToDelete, setTruckToDelete] = useState<string | null>(null);

  const { data: trucks } = useTrucks();
  const { addTruck, updateTruck, deleteTruck } = useTruckMutations();

  const form = useForm({
    resolver: yupResolver(TruckSchema),
  });

  const handleClose = () => {
    form.reset({});
    setEditingTruckId(null);
    setIsTruckFormOpen(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await storage(file);

      form.setValue('docUrl', url);
    } catch (err) {
      toast.error('Error to upload the document.');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: TruckData) => {
    try {
      if (editingTruckId) {
        await updateTruck.mutateAsync({ id: editingTruckId, data });
        toast.success('Truck updated successfully!');
      } else {
        await addTruck.mutateAsync({
          driverId: null,
          ...data,
        });
        toast.success('Truck added successfully!');
      }
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${editingTruckId ? 'update' : 'add'} truck.`);
    }
  };

  const handleOnDelete = async () => {
    if (!truckToDelete) return;

    try {
      await deleteTruck.mutateAsync(truckToDelete);
      toast.success('Truck deleted successfully!');
      setTruckToDelete(null);
    } catch (error) {
      toast.error('Failed to delete truck.');
    }
  };

  const handleOnEdit = (id: string) => {
    const truck = trucks?.find(t => t.id === id);
    if (!truck) return;

    setEditingTruckId(id);
    form.reset(truck);
    setIsTruckFormOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trucks</h1>
        <Button
          onClick={() => {
            setEditingTruckId(null);
            form.reset({});
            setIsTruckFormOpen(true);
          }}
        >
          <Plus className="mr-2" size={16} />
          New Truck
        </Button>
      </div>

      <TruckFormDialog
        editingTruckId={editingTruckId}
        form={form}
        isOpen={isTruckFormOpen}
        isUploading={uploading}
        onClose={handleClose}
        onFileUpload={handleFileUpload}
        onSubmit={onSubmit}
      />

      <DeleteTruckDialog
        isDeleting={deleteTruck.isPending}
        isOpen={!!truckToDelete}
        onClose={() => setTruckToDelete(null)}
        onDelete={handleOnDelete}
      />

      <TrucksTable
        onDelete={setTruckToDelete}
        onEdit={handleOnEdit}
        trucks={trucks || []}
      />
    </div>
  );
}
