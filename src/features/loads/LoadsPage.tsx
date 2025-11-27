import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui';
import { useTrucks } from '@/features/trucks';

import { LoadMap } from './components/LoadMap';
import { LoadData, LoadsFormDialog } from './components/LoadsFormDialog';
import { LoadsTable } from './components/LoadsTable';
import { useLoadMutations, useLoads } from './hooks/useLoads';
import { LoadSchema } from './schema/LoadSchema';
import { Load, LoadStatus, loadStatusLabelMap } from './types/Load';

export default function LoadsPage() {
  const [isLoadFormOpen, setIsLoadFormOpen] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);

  const { data: loads } = useLoads();
  const { data: trucks } = useTrucks();
  const { addLoad, updateStatus } = useLoadMutations();

  const form = useForm<LoadData>({
    resolver: yupResolver(LoadSchema),
  });

  const handleClose = () => {
    form.reset({});
    setIsLoadFormOpen(false);
  };

  const onSubmit = async (data: LoadData) => {
    try {
      await addLoad.mutateAsync(data);
      alert('Load created successfully!');
      handleClose();
    } catch (error) {
      alert('Failed to create load.');
      console.error(error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: LoadStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status: newStatus });
      alert('Load status changed to ' + loadStatusLabelMap[newStatus]);
    } catch (error) {
      alert('Failed to create load.');
      console.error(error);
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex gap-6">
      <div className="w-1/2 flex flex-col space-y-6 overflow-y-auto pr-2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Loads</h1>
          <Button
            onClick={() => {
              setIsLoadFormOpen(true);
              setSelectedLoad(null);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Load
          </Button>
        </div>

        <LoadsFormDialog
          isOpen={isLoadFormOpen}
          onClose={handleClose}
          onSubmit={onSubmit}
          form={form}
          trucks={trucks || []}
        />

        <LoadsTable
          loads={loads}
          selectedLoad={selectedLoad}
          setSelectedLoad={setSelectedLoad}
          handleStatusChange={handleStatusChange}
        />
      </div>

      <LoadMap selectedLoad={selectedLoad} />
    </div>
  );
}
