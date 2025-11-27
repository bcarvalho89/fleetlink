import {
  CheckCircle2,
  Clock,
  Map as MapIcon,
  Truck,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Badge, Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDrivers } from '@/features/drivers';
import { LoadStatus, loadStatusLabelMap, useLoads } from '@/features/loads';
import { useAvailableTrucks } from '@/features/trucks';

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: loads } = useLoads();
  const { data: trucks } = useAvailableTrucks();
  const { data: drivers } = useDrivers();

  const plannedLoads =
    loads?.filter(l => l.status === LoadStatus.PLANNED).length || 0;
  const inRouteLoads =
    loads?.filter(l => l.status === LoadStatus.IN_ROUTE).length || 0;
  const deliveredLoads =
    loads?.filter(l => l.status === LoadStatus.DELIVERED).length || 0;

  const availableTrucks = trucks?.length || 0;
  const totalDrivers = drivers?.length || 0;

  const recentLoads = loads
    ?.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 5);

  const renderCard = ({
    title,
    icon,
    number,
    description,
  }: {
    title: string;
    icon: React.ReactNode;
    number: string | number;
    description: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{number}</div>
        <p className="text-xs text-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-foreground">Overview of your fleet operations.</p>
      </div>

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-5">
        {renderCard({
          description: 'Currently on the road',
          icon: <MapIcon size={16} className="text-blue-500" />,
          number: inRouteLoads,
          title: 'Loads In Route',
        })}

        {renderCard({
          description: 'Waiting for departure',
          icon: <Clock size={16} className="text-orange-500" />,
          number: plannedLoads,
          title: 'Planned Loads',
        })}

        {renderCard({
          description: 'Delivery finished',
          icon: <CheckCircle2 size={16} className="text-green-500" />,
          number: deliveredLoads,
          title: 'Delivered Loads',
        })}

        {renderCard({
          description: 'Active & ready to assign',
          icon: <Truck size={16} className="text-green-500" />,
          number: availableTrucks,
          title: 'Available Trucks',
        })}

        {renderCard({
          description: 'Registered in system',
          icon: <Users size={16} className="text-foreground" />,
          number: totalDrivers,
          title: 'Total Drivers',
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-7">
          <CardHeader>
            <CardTitle>Recent Loads</CardTitle>
          </CardHeader>
          <CardContent>
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
                {recentLoads?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center h-24 text-muted-foreground"
                    >
                      No loads created yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentLoads?.map(load => (
                    <TableRow key={load.id}>
                      <TableCell className="font-medium">
                        {load.description}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{load.origin.address}</div>
                        <div className="text-xs text-foreground">
                          to {load.destination.address}
                        </div>
                      </TableCell>
                      <TableCell>
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
                      <TableCell className="text-right">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
