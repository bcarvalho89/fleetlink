import { Milestone } from 'lucide-react';

import {
  Button,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { cn } from '@/lib/utils';

import { Load, LoadStatus, loadStatusLabelMap } from '../types/Load';

interface LoadsTableProps {
  loads: Load[];
  selectedLoad: Load | null;
  setSelectedLoad: (load: Load | null) => void;
  handleStatusChange: (id: string, newStatus: LoadStatus) => void;
}

export const LoadsTable = ({
  loads,
  handleStatusChange,
  selectedLoad,
  setSelectedLoad,
}: LoadsTableProps) => {
  return (
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
                    handleStatusChange(load.id, e.target.value as LoadStatus)
                  }
                  className="h-8 text-xs"
                >
                  {Object.values(LoadStatus).map(value => (
                    <option key={value} value={value}>
                      {loadStatusLabelMap[value]}
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
  );
};
