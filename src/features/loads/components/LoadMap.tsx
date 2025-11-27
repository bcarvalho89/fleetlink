import { MapPin, TruckIcon } from 'lucide-react';

import { MapComponent } from '@/components/common/Map';

import { Load } from '../types/Load';

interface LoadMapProps {
  selectedLoad: Load | null;
}

export const LoadMap = ({ selectedLoad }: LoadMapProps) => {
  return (
    <div className="w-1/2 bg-muted text-muted-foreground rounded-lg border border-border overflow-hidden relative flex flex-col">
      {selectedLoad ? (
        <>
          <div className="absolute text-foreground top-0 left-0 right-0 z-10 bg-background/80 p-4 backdrop-blur border-b border-border">
            <h3 className="font-bold flex items-center gap-2">
              <TruckIcon className="h-4 w-4" />
              Route for: {selectedLoad.description}
            </h3>
            <p className="text-sm text-foreground mt-1">
              <strong>From</strong>:{' '}
              <span className="text-foreground">
                {selectedLoad.origin.address}
              </span>
              <br />
              <strong>To</strong>:{' '}
              <span className="text-foreground">
                {selectedLoad.destination.address}
              </span>
            </p>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-center h-full flex-col">
              <MapComponent
                destination={selectedLoad.destination}
                origin={selectedLoad.origin}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <MapPin size={64} className="mb-4 opacity-40" />
          <p>Select a load to view the route</p>
        </div>
      )}
    </div>
  );
};
