import { SquarePen, Trash2 } from 'lucide-react';

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { Truck } from '@/features/trucks';

import { Driver } from '../types/Driver';

interface DriversTableProps {
  drivers: Driver[];
  trucks: Truck[];
  onEdit: (driver: Driver) => void;
  onDelete: (driverId: string) => void;
}

export const DriversTable = ({
  drivers,
  trucks,
  onDelete,
  onEdit,
}: DriversTableProps) => {
  return (
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
              <TableCell
                colSpan={5}
                className="text-center h-24 text-foreground"
              >
                No drivers found.
              </TableCell>
            </TableRow>
          ) : (
            drivers?.map(driver => {
              const truck = trucks?.find(truck => truck.id === driver.truckId);

              return (
                <TableRow key={driver.id}>
                  <TableCell data-header="Name" className="font-medium">
                    {driver.name}
                  </TableCell>
                  <TableCell data-header="Phone">{driver.phone}</TableCell>
                  <TableCell data-header="CNH">{driver.cnh}</TableCell>
                  <TableCell data-header="Truck">
                    {truck ? `${truck.plate} / ${truck.model}` : '-'}
                  </TableCell>
                  <TableCell
                    data-header="Actions"
                    className="space-x-2 lg:text-right"
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      title="Edit"
                      onClick={() => onEdit(driver)}
                    >
                      <SquarePen size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      title="Remove"
                      onClick={() => onDelete(driver.id)}
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
  );
};
