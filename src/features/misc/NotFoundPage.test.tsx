import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { render, screen } from '@/test/test-utils';

import NotFound from './NotFoundPage';

describe('NotFoundPage', () => {
  it('should render the not found message and a link to the homepage', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /404 - Not Found/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The page you are looking for does not exist./i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Go to Homepage/i }),
    ).toHaveAttribute('href', '/');
  });
});
