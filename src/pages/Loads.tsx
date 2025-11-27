import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
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
import { useLoads, useLoadMutations } from '@/hooks/useLoads';
import { useTrucks } from '@/hooks/useTrucks';
import { cn } from '@/lib/utils';
import { LoadSchema } from '@/schemas/LoadSchema';
import { Load, LoadStatus, LoadStatusLabelMap, TruckStatus } from '@/types';

type LoadData = yup.InferType<typeof LoadSchema>;

export default function LoadsPage() {
  const [isLoadFormOpen, setIsLoadFormOpen] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);

  const { data: loads, isLoading } = useLoads();
  const { data: trucks } = useTrucks();
  const { addLoad, updateStatus } = useLoadMutations();

  const activeTrucks = trucks?.filter(
    t => t.driverId && t.status === TruckStatus.ACTIVE,
  );

  const form = useForm<LoadData>({
    resolver: yupResolver(LoadSchema),
  });
  const { watch, setValue } = form;

  const selectedTruckId = watch('truckId');

  useEffect(() => {
    if (selectedTruckId && activeTrucks) {
      const truck = activeTrucks.find(t => t.id === selectedTruckId);
      if (truck) {
        setValue('driverId', truck.driverId);
      }
    }
  }, [selectedTruckId, activeTrucks, setValue]);

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

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatus.mutate({ id, status: newStatus });
  };

  const hasNoTrucksAvaliable = activeTrucks?.length === 0;

  if (isLoading) return <div className="p-8">Loading loads...</div>;

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

        <Dialog
          isOpen={isLoadFormOpen}
          onClose={handleClose}
          title="Create New Load"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Electronics shipment"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="15000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="originAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin Address</FormLabel>
                      <FormControl>
                        <Input placeholder="City, State" {...field} />
                      </FormControl>
                      <FormDescription>
                        We will random coords near São Paulo for demo purposes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destinationAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Address</FormLabel>
                      <FormControl>
                        <Input placeholder="City, State" {...field} />
                      </FormControl>
                      <FormDescription>
                        We will random coords near São Paulo for demo purposes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="truckId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Truck</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <option value="">Select a truck...</option>
                        {activeTrucks?.map(truck => (
                          <option key={truck.id} value={truck.id}>
                            {truck.model} ({truck.plate}) - {truck.driverName}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    {hasNoTrucksAvaliable && (
                      <FormDescription className="text-yellow-600">
                        No active trucks with drivers available.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <LoadingButton
                  type="submit"
                  loading={form.formState.isSubmitting}
                  disabled={hasNoTrucksAvaliable}
                >
                  Create Load
                </LoadingButton>
              </div>
            </form>
          </Form>
        </Dialog>

        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Desc</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loads?.map(load => (
                <TableRow
                  key={load.id}
                  className={cn(
                    'cursor-pointer',
                    selectedLoad?.id === load.id && 'bg-muted/30',
                  )}
                  onClick={() => setSelectedLoad(load)}
                >
                  <TableCell>
                    <div className="font-medium">{load.description}</div>
                    <div className="text-xs text-foreground/60">
                      {load.origin.address} → {load.destination.address}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={load.status}
                      onClick={e => e.stopPropagation()}
                      onChange={e =>
                        handleStatusChange(load.id, e.target.value)
                      }
                      className="h-8 text-xs"
                    >
                      {Object.values(LoadStatus).map(value => (
                        <option key={value} value={value}>
                          {LoadStatusLabelMap[value]}
                        </option>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLoad(load)}
                    >
                      View Map
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="w-1/2 bg-muted text-muted-foreground rounded-lg border border-border overflow-hidden relative flex flex-col">
        <p>Map placeholder</p>
      </div>
    </div>
  );
}
