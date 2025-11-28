import { Truck } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { SummaryCard } from './SummaryCard';

describe('SummaryCard', () => {
  it('should render properly', () => {
    render(
      <SummaryCard
        title="Total Trucks"
        number="15"
        description="All trucks in the fleet"
        icon={<Truck data-testid="truck-icon" />}
      />,
    );

    expect(screen.getByText('Total Trucks')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('All trucks in the fleet')).toBeInTheDocument();
    expect(screen.getByTestId('truck-icon')).toBeInTheDocument();
  });
});
