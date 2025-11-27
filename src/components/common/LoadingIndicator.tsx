import { Loader2, Truck } from 'lucide-react';

const LoadingIndicator = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 rounded-full border-4 border-primary/20"></div>
        </div>

        <Loader2 size={96} className="animate-spin text-primary" />

        <div className="absolute flex items-center justify-center">
          <div className="bg-background p-2 rounded-full">
            <Truck size={32} className="text-foreground fill-primary/10" />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          FleetLink
        </h1>
        <p className="text-sm text-foreground animate-pulse">
          Loading your workspace...
        </p>
      </div>
    </div>
  );
};

export default LoadingIndicator;
