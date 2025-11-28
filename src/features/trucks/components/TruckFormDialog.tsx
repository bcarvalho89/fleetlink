import { UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';

import { Dialog, Input, LoadingButton, Select } from '@/components/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { TruckSchema } from '../schemas/TruckSchema';
import { TruckStatus, truckStatusLabelMap } from '../types/Truck';

export type TruckData = yup.InferType<typeof TruckSchema>;

interface TruckFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: TruckData) => void;
  editingTruckId: string | null;
  form: UseFormReturn<TruckData>;
  isUploading: boolean;
}

export const TruckFormDialog = ({
  editingTruckId,
  form,
  isOpen,
  onClose,
  onSubmit,
  onFileUpload,
  isUploading,
}: TruckFormDialogProps) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={editingTruckId ? 'Edit Truck' : 'Register Truck'}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="plate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plate</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC-1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="Volvo FH16" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity (kg)</FormLabel>
                  <FormControl>
                    <Input placeholder="20000" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={new Date().getFullYear().toString()}
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      {Object.values(TruckStatus).map(value => (
                        <option key={value} value={value}>
                          {truckStatusLabelMap[value]}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="docUrl"
              render={() => (
                <FormItem>
                  <FormLabel>Document (PDF/JPG)</FormLabel>
                  <div>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={onFileUpload}
                        value={undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                  {isUploading && (
                    <span className="text-sm text-muted-foreground animate-pulse mt-1">
                      Uploading...
                    </span>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-4">
            <LoadingButton
              type="submit"
              disabled={form.formState.isSubmitting || isUploading}
              loading={form.formState.isSubmitting}
            >
              Save Truck
            </LoadingButton>
          </div>
        </form>
      </Form>
    </Dialog>
  );
};
