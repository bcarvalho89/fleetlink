import { yupResolver } from '@hookform/resolvers/yup';
import { MapPin, Milestone, Plus, TruckIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { MapComponent } from '@/components/Map';
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

  const handleStatusChange = async (id: string, newStatus: LoadStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status: newStatus });
      alert('Load status changed to ' + LoadStatusLabelMap[newStatus]);
    } catch (error) {
      alert('Failed to create load.');
      console.error(error);
    }
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
                    <div className="text-xs text-foreground/60 flex gap-0.5 items-center">
                      {load.origin.address}
                      <Milestone size={12} />
                      {load.destination.address}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={load.status}
                      onClick={e => e.stopPropagation()}
                      onChange={e =>
                        handleStatusChange(
                          load.id,
                          e.target.value as LoadStatus,
                        )
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
        {selectedLoad ? (
          <>
            <div className="absolute text-foreground top-0 left-0 right-0 z-10 bg-background/80 p-4 backdrop-blur border-b border-border">
              <h3 className="font-bold flex items-center gap-2">
                <TruckIcon className="h-4 w-4" />
                Route for: {selectedLoad.description}
              </h3>
              <p className="text-sm text-foreground mt-1">
                <strong>From</strong>:{' '}
                <span className="text-foreground">
                  {selectedLoad.origin.address}
                </span>
                <br />
                <strong>To</strong>:{' '}
                <span className="text-foreground">
                  {selectedLoad.destination.address}
                </span>
              </p>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-center h-full flex-col">
                <MapComponent
                  destination={selectedLoad.destination}
                  origin={selectedLoad.origin}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MapPin size={64} className="mb-4 opacity-40" />
            <p>Select a load to view the route</p>
          </div>
        )}
      </div>
    </div>
  );
}
