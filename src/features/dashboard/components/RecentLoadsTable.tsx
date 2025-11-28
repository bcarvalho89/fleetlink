import { useNavigate } from 'react-router-dom';

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
import { Load, LoadStatus, loadStatusLabelMap } from '@/features/loads';

interface RecentLoadsTableProps {
  loads: Load[];
}

export const RecentLoadsTable = ({ loads }: RecentLoadsTableProps) => {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Route</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loads?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center h-24 text-foreground">
              No loads created yet.
            </TableCell>
          </TableRow>
        ) : (
          loads?.map(load => (
            <TableRow key={load.id}>
              <TableCell data-header="Description" className="font-medium">
                {load.description}
              </TableCell>
              <TableCell data-header="Route">
                <div className="text-sm max-sm:mr-1">{load.origin.address}</div>
                <div className="sm:text-xs text-foreground">
                  to {load.destination.address}
                </div>
              </TableCell>
              <TableCell data-header="Status">
                <Badge
                  variant={
                    load.status === LoadStatus.IN_ROUTE
                      ? 'info'
                      : load.status === LoadStatus.PLANNED
                        ? 'warning'
                        : 'success'
                  }
                >
                  {loadStatusLabelMap[load.status]}
                </Badge>
              </TableCell>
              <TableCell data-header="Actions" className="lg:text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/loads')}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
