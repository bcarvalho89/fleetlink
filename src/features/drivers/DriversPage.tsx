import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui';
import { useAvailableTrucks, useTrucks } from '@/features/trucks';

import { DeleteDriverDialog } from './components/DeleteDriverDialog';
import { DriverData, DriverFormDialog } from './components/DriverFormDialog';
import { DriversTable } from './components/DriversTable';
import { useDriverMutations, useDrivers } from './hooks/useDrivers';
import { DriverSchema } from './schemas/DriverSchema';
import { Driver } from './types/Driver';

export default function DriversPage() {
  const [isDriverFormDialogOpen, setIsDriverFormDialogOpen] = useState(false);
  const [editingDriverId, setEditingDriverId] = useState<string | null>(null);
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);

  const { data: drivers } = useDrivers();
  const { data: availableTrucks } = useAvailableTrucks();
  const { data: allTrucks } = useTrucks();

  const { addDriver, updateDriver, deleteDriver } = useDriverMutations();

  const form = useForm<DriverData>({
    resolver: yupResolver(DriverSchema),
  });

  const truckOptions = useMemo(() => {
    const currentTruckId = form.getValues('truckId');
    const isTruckInAvailableList = availableTrucks?.some(
      truck => truck.id === currentTruckId,
    );

    if (editingDriverId && currentTruckId && !isTruckInAvailableList) {
      const currentTruck = allTrucks?.find(
        truck => truck.id === currentTruckId,
      );
      if (currentTruck) {
        return [...(availableTrucks || []), currentTruck];
      }
    }

    return availableTrucks || [];
  }, [availableTrucks, allTrucks, editingDriverId, form]);

  const handleClose = () => {
    form.reset({});
    setEditingDriverId(null);
    setIsDriverFormDialogOpen(false);
  };

  const onSubmit = async (data: DriverData) => {
    try {
      const driverData = {
        ...data,
        truckId: data.truckId || null,
      };

      if (editingDriverId) {
        await updateDriver.mutateAsync({
          id: editingDriverId,
          data: driverData,
        });
        toast.success('Driver updated successfully!');
      } else {
        await addDriver.mutateAsync(driverData);
        toast.success('Driver created successfully!');
      }
      handleClose();
    } catch (error) {
      toast.error(`Failed to ${editingDriverId ? 'update' : 'create'} driver.`);
    }
  };

  const handleOnEdit = (driver: Driver) => {
    setEditingDriverId(driver.id);
    form.reset(driver);
    setIsDriverFormDialogOpen(true);
  };

  const handleOnDelete = async () => {
    if (!driverToDelete) return;
    try {
      await deleteDriver.mutateAsync(driverToDelete);
      toast.success(`Driver deleted successfully!`);
      setDriverToDelete(null);
    } catch (error) {
      toast.error(`Failed delete driver.`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Drivers</h1>
        <Button
          onClick={() => {
            setEditingDriverId(null);
            form.reset({});
            setIsDriverFormDialogOpen(true);
          }}
        >
          <Plus className="mr-2" size={16} />
          New Driver
        </Button>
      </div>

      <DriverFormDialog
        isOpen={isDriverFormDialogOpen}
        onClose={handleClose}
        onSubmit={onSubmit}
        editingDriverId={editingDriverId}
        form={form}
        truckOptions={truckOptions}
      />

      <DeleteDriverDialog
        isDeleting={deleteDriver.isPending}
        onDelete={handleOnDelete}
        isOpen={!!driverToDelete}
        onClose={() => setDriverToDelete(null)}
      />

      <DriversTable
        drivers={drivers}
        trucks={allTrucks || []}
        onEdit={handleOnEdit}
        onDelete={setDriverToDelete}
      />
    </div>
  );
}
