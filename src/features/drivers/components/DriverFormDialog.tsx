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
import { Truck } from '@/features/trucks';

import { DriverSchema } from '../schemas/DriverSchema';

export type DriverData = yup.InferType<typeof DriverSchema>;

interface DriverFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DriverData) => void;
  editingDriverId: string | null;
  form: UseFormReturn<DriverData>;
  truckOptions: Truck[];
}

export const DriverFormDialog = (props: DriverFormDialogProps) => {
  const { isOpen, onClose, onSubmit, editingDriverId, form, truckOptions } =
    props;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
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
            <LoadingButton type="submit" loading={form.formState.isSubmitting}>
              Save Driver
            </LoadingButton>
          </div>
        </form>
      </Form>
    </Dialog>
  );
};
