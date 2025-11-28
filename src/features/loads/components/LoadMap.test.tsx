import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { Load, LoadStatus } from '../types/Load';

import { LoadMap } from './LoadMap';

// Mock the MapComponent to avoid dealing with Mapbox GL JS
vi.mock('@/components/common/Map', () => ({
  MapComponent: ({
    origin,
    destination,
  }: {
    origin: { address: string };
    destination: { address: string };
  }) => (
    <div data-testid="map-component">
      <p>Origin: {origin.address}</p>
      <p>Destination: {destination.address}</p>
    </div>
  ),
}));

const mockLoad: Partial<Load> = {
  id: '1',
  description: 'Test Load',
  status: LoadStatus.PLANNED,
  origin: { address: 'City A', lat: 0, lng: 0 },
  destination: { address: 'City B', lat: 0, lng: 0 },
};

describe('LoadMap', () => {
  it('should render a placeholder when no load is selected', () => {
    render(<LoadMap selectedLoad={null} />);

    expect(
      screen.getByText('Select a load to view the route'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('map-component')).not.toBeInTheDocument();
  });

  it('should render load details and the map when a load is selected', () => {
    render(<LoadMap selectedLoad={mockLoad as Load} />);

    expect(screen.getByText(/route for: test load/i)).toBeInTheDocument();
    expect(screen.getByText(/origin: city a/i)).toBeInTheDocument();
    expect(screen.getByText(/destination: city b/i)).toBeInTheDocument();
    expect(screen.getByTestId('map-component')).toBeInTheDocument();
  });
});
