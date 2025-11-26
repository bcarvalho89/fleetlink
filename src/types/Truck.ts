export enum TruckStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
}

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
