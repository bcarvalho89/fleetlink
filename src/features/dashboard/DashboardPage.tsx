import {
  CheckCircle2,
  Clock,
  Map as MapIcon,
  Truck,
  Users,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDrivers } from '@/features/drivers';
import { LoadStatus, useLoads } from '@/features/loads';
import { useAvailableTrucks } from '@/features/trucks';

import { RecentLoadsTable } from './components/RecentLoadsTable';
import { SummaryCard } from './components/SummaryCard';

export default function Dashboard() {
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

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-foreground">Overview of your fleet operations.</p>
      </div>

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-5">
        <SummaryCard
          description="Currently on the road"
          icon={<MapIcon size={16} className="text-blue-500" />}
          number={inRouteLoads}
          title="Loads In Route"
        />

        <SummaryCard
          description="Waiting for departure"
          icon={<Clock size={16} className="text-orange-500" />}
          number={plannedLoads}
          title="Planned Loads"
        />

        <SummaryCard
          description="Delivery finished"
          icon={<CheckCircle2 size={16} className="text-green-500" />}
          number={deliveredLoads}
          title="Delivered Loads"
        />

        <SummaryCard
          description="Active & ready to assign"
          icon={<Truck size={16} className="text-green-500" />}
          number={availableTrucks}
          title="Available Trucks"
        />

        <SummaryCard
          description="Registered in system"
          icon={<Users size={16} className="text-foreground" />}
          number={totalDrivers}
          title="Total Drivers"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-7">
          <CardHeader>
            <CardTitle>Recent Loads</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentLoadsTable loads={recentLoads} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
