import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef, useState } from 'react';

import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from '@/lib/utils';

interface MapProps {
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
}

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

export const MapComponent: React.FC<MapProps> = ({ origin, destination }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [routeDistance, setRouteDistance] = useState<string | null>(null);
  const [routeDuration, setRouteDuration] = useState<string | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-46.6333, -23.5505], // Default: São Paulo
      zoom: 4,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  }, []);

  useEffect(() => {
    const mapInstance = map.current;
    if (!mapInstance || !origin || !destination) return;

    const markers: mapboxgl.Marker[] = [];

    const fetchRoute = async () => {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      );
      const json = await query.json();
      const data = json.routes[0];

      if (!data) return;

      const route = data.geometry.coordinates;

      setRouteDistance((data.distance / 1000).toFixed(1) + ' km');
      setRouteDuration((data.duration / 60).toFixed(0) + ' min');

      const geojson: GeoJSON.GeoJSON = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route,
        },
      };

      if (mapInstance.getSource('route')) {
        (mapInstance.getSource('route') as mapboxgl.GeoJSONSource).setData(
          geojson,
        );
      } else {
        mapInstance.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson,
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#557fd2',
            'line-width': 5,
            'line-opacity': 0.75,
          },
        });
      }

      const originMarker = new mapboxgl.Marker({ color: 'green' })
        .setLngLat([origin.lng, origin.lat])
        .addTo(mapInstance);
      markers.push(originMarker);

      const destMarker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat([destination.lng, destination.lat])
        .addTo(mapInstance);
      markers.push(destMarker);

      const bounds = new mapboxgl.LngLatBounds()
        .extend([origin.lng, origin.lat])
        .extend([destination.lng, destination.lat]);

      mapInstance.fitBounds(bounds, { padding: 50 });
    };

    const onMapLoad = () => {
      fetchRoute();
    };

    if (mapInstance.isStyleLoaded()) {
      onMapLoad();
    } else {
      mapInstance.on('load', onMapLoad);
    }

    return () => {
      mapInstance.off('load', onMapLoad);
      markers.forEach(marker => marker.remove());
      if (mapInstance.getSource('route')) {
        mapInstance.removeLayer('route');
        mapInstance.removeSource('route');
      }
    };
  }, [origin, destination]);

  const baseInfoBoxClass =
    'absolute left-4 max-w-3xs bg-background/90 backdrop-blur shadow text-sm z-10 p-2 rounded';

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-border">
      <div ref={mapContainer} className="w-full h-full" />

      <div className={cn(baseInfoBoxClass, 'bottom-20 text-destructive')}>
        <p>
          <strong>Attention:</strong> We are randomizing the addresses
          coordinates for demo purposes. You can see more{' '}
          <a
            href="https://github.com/bcarvalho89/fleetlink/blob/master/src/features/loads/hooks/useLoads.ts#L46-L55"
            className="underline underline-offset-4"
          >
            here
          </a>
          .
        </p>
      </div>

      <div
        className={cn(
          baseInfoBoxClass,
          'bottom-4 text-foreground p-2 font-semibold',
        )}
      >
        {routeDistance && <p>Distance: {routeDistance}</p>}
        {routeDuration && <p>Duration: {routeDuration}</p>}
      </div>
    </div>
  );
};
