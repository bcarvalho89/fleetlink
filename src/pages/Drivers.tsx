import { yupResolver } from '@hookform/resolvers/yup';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button, Dialog, Input, LoadingButton, Select } from '@/components/ui';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDrivers, useDriverMutations } from '@/hooks/useDrivers';
import { DriverSchema } from '@/schemas/DriverSchema';
import { Driver } from '@/types';
import { useAvailableTrucks, useTrucks } from '@/features/trucks';

type DriverData = yup.InferType<typeof DriverSchema>;

export default function DriversPage() {
  const [isDriverFormOpen, setIsDriverFormOpen] = useState(false);
  const [editingDriverId, setEditingDriverId] = useState<string | null>(null);
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);

  const { data: drivers, isLoading } = useDrivers();
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
    setIsDriverFormOpen(false);
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
        alert('Driver updated successfully!');
      } else {
        await addDriver.mutateAsync(driverData);
        alert('Driver created successfully!');
      }
      handleClose();
    } catch (error) {
      console.error(
        `Failed to ${editingDriverId ? 'update' : 'create'} driver`,
        error,
      );
      alert(`Failed to ${editingDriverId ? 'update' : 'create'} driver.`);
    }
  };

  const handleOnEdit = (driver: Driver) => {
    setEditingDriverId(driver.id);
    form.reset(driver);
    setIsDriverFormOpen(true);
  };

  const handleOnDelete = async () => {
    if (!driverToDelete) return;
    try {
      await deleteDriver.mutateAsync(driverToDelete);
      alert('Driver deleted successfully!');
      setDriverToDelete(null);
    } catch (error) {
      console.error('Failed to delete driver:', error);
      alert('Failed to delete driver.');
    }
  };

  if (isLoading) return <div className="p-8">Loading drivers...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Drivers</h1>
        <Button
          onClick={() => {
            setEditingDriverId(null);
            form.reset({});
            setIsDriverFormOpen(true);
          }}
        >
          <Plus className="mr-2" size={16} />
          New Driver
        </Button>
      </div>

      <Dialog
        isOpen={isDriverFormOpen}
        onClose={handleClose}
        title={editingDriverId ? 'Edit Driver' : 'Register Driver'}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="(55) 99999-9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cnh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNH (License)</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="truckId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link to Truck (Optional)</FormLabel>
                    <FormControl>
                      <Select {...field} value={field.value || ''}>
                        <option value="">No truck assigned</option>
                        {truckOptions.map(truck => (
                          <option key={truck.id} value={truck.id}>
                            {truck.model} - {truck.plate}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Only trucks without drivers are shown.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
              >
                Save Driver
              </LoadingButton>
            </div>
          </form>
        </Form>
      </Dialog>

      <Dialog
        isOpen={!!driverToDelete}
        onClose={() => setDriverToDelete(null)}
        title="Confirm Deletion"
      >
        <p>
          Are you sure you want to delete this driver? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => setDriverToDelete(null)}>
            Cancel
          </Button>
          <LoadingButton
            variant="destructive"
            onClick={handleOnDelete}
            loading={deleteDriver.isPending}
          >
            Delete
          </LoadingButton>
        </div>
      </Dialog>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>CNH</TableHead>
              <TableHead>Truck</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No drivers found.
                </TableCell>
              </TableRow>
            ) : (
              drivers?.map(driver => {
                const truck = allTrucks?.find(
                  truck => truck.id === driver.truckId,
                );

                return (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">{driver.name}</TableCell>
                    <TableCell>{driver.phone}</TableCell>
                    <TableCell>{driver.cnh}</TableCell>
                    <TableCell>
                      {truck ? `${truck.plate} / ${truck.model}` : '-'}
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Edit"
                        onClick={() => handleOnEdit(driver)}
                      >
                        <SquarePen size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        title="Remove"
                        onClick={() => setDriverToDelete(driver.id)}
                        disabled={!!driver.truckId}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
