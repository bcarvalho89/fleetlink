import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button, Dialog, Input, LoadingButton, Select } from '@/components/ui';
import {
  Form,
  FormControl,
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
import { useTrucks, useTruckMutations } from '@/hooks/useTrucks';
import { storage } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { TruckSchema } from '@/schemas/TruckSchema';

type TruckData = yup.InferType<typeof TruckSchema>;

export default function TrucksPage() {
  const [isTruckFormOpen, setIsTruckFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: trucks, isLoading } = useTrucks();
  const { addTruck } = useTruckMutations();

  const form = useForm({
    resolver: yupResolver(TruckSchema),
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await storage(file);

      console.log('URL:', url);
      form.setValue('docUrl', url);
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: TruckData) => {
    try {
      await addTruck.mutateAsync({
        driverId: null,
        ...data,
      });
      form.reset();
      setIsTruckFormOpen(false);
      alert('Truck added successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  const isSubmitting = form.formState.isSubmitting || uploading;

  if (isLoading) return <div className="p-8">Loading trucks...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trucks</h1>
        <Button onClick={() => setIsTruckFormOpen(true)}>
          <Plus className="mr-2" size={16} />
          New Truck
        </Button>
      </div>

      <Dialog
        isOpen={isTruckFormOpen}
        onClose={() => setIsTruckFormOpen(false)}
        title="Register Truck"
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
                        <option value="active">Active</option>
                        <option value="maintenance">Maintenance</option>
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
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={handleFileUpload}
                      />
                      {uploading && (
                        <span className="text-sm text-muted-foreground animate-pulse">
                          Uploading...
                        </span>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <LoadingButton
                type="submit"
                disabled={isSubmitting || uploading}
                loading={isSubmitting}
              >
                Save Truck
              </LoadingButton>
            </div>
          </form>
        </Form>
      </Dialog>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plate</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Driver</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trucks?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No trucks found.
                </TableCell>
              </TableRow>
            ) : (
              trucks?.map(truck => (
                <TableRow key={truck.id}>
                  <TableCell className="font-medium">{truck.plate}</TableCell>
                  <TableCell>{truck.model}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        truck.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800',
                      )}
                    >
                      {truck.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {truck.driverName ? (
                      truck.driverName
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
