export enum LoadStatus {
  DELIVERED = 'delivered',
  IN_ROUTE = 'in_route',
  PLANNED = 'planned',
}

export const loadStatusLabelMap: Record<LoadStatus, string> = {
  [LoadStatus.DELIVERED]: 'Delivered',
  [LoadStatus.IN_ROUTE]: 'In Route',
  [LoadStatus.PLANNED]: 'Planned',
};

export interface Load {
  id: string;
  description: string;
  weight: number;
  origin: {
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    lat: number;
    lng: number;
  };
  status: LoadStatus;
  driverId: string;
  truckId: string;
  createdAt: number;
}
