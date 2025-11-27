import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';

import { Dialog, Input, LoadingButton, Select } from '@/components/ui';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Truck, TruckStatus } from '@/features/trucks';

import { LoadSchema } from '../schema/LoadSchema';

export type LoadData = yup.InferType<typeof LoadSchema>;

interface LoadsFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LoadData) => void;
  form: UseFormReturn<LoadData>;
  trucks: Truck[];
}

export const LoadsFormDialog = (props: LoadsFormDialogProps) => {
  const { isOpen, onClose, onSubmit, form, trucks } = props;

  const activeTrucks = trucks?.filter(
    t => t.driverId && t.status === TruckStatus.ACTIVE,
  );
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
  const hasNoTrucksAvaliable = activeTrucks?.length === 0;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Create New Load">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Electronics shipment" {...field} />
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
  );
};
