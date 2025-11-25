import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTrucks } from '@/hooks/useTrucks';
import { cn } from '@/lib/utils';

export default function TrucksPage() {
  const { data: trucks, isLoading } = useTrucks();

  if (isLoading) return <div className="p-8">Loading trucks...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trucks</h1>
      </div>

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
