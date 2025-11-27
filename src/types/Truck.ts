export enum TruckStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
}

export const TruckStatusLabelMap: Record<TruckStatus, string> = {
  [TruckStatus.ACTIVE]: 'Active',
  [TruckStatus.MAINTENANCE]: 'Maintenance',
};

export interface Truck {
  id: string;
  plate: string;
  model: string;
  capacity: number;
  year: number;
  status: TruckStatus;
  driverId: string | null;
  docUrl: string;
  driverName?: string;
}
