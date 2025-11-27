import { SquarePen, Trash2 } from 'lucide-react';

import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';

import { Truck, TruckStatus, truckStatusLabelMap } from '../types/Truck';

interface TrucksTableProps {
  trucks: Truck[];
  onEdit: (id: string) => void;
  onDelete: (truckId: string) => void;
}

export const TrucksTable = ({ trucks, onDelete, onEdit }: TrucksTableProps) => {
  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plate</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                <TableCell data-header="Plate" className="font-medium">
                  {truck.plate}
                </TableCell>
                <TableCell data-header="Model">{truck.model}</TableCell>
                <TableCell data-header="Status">
                  <Badge
                    variant={
                      truck.status === TruckStatus.ACTIVE ? 'success' : 'danger'
                    }
                  >
                    {truckStatusLabelMap[truck.status]}
                  </Badge>
                </TableCell>
                <TableCell data-header="Driver">
                  {truck.driverName ? (
                    truck.driverName
                  ) : (
                    <span className="text-foreground">-</span>
                  )}
                </TableCell>
                <TableCell
                  data-header="Actions"
                  className="space-x-2 lg:text-right"
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Edit"
                    onClick={() => onEdit(truck.id)}
                  >
                    <SquarePen size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    title="Remove"
                    disabled={!!truck.driverId}
                    onClick={() => onDelete(truck.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
