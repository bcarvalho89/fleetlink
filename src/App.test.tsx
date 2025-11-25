import { render, screen } from '@testing-library/react';

import App from './App';

describe('App', () => {
  it('renders the app', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(
      screen.getByText('This is the login page for FleetLink.'),
    ).toBeInTheDocument();
  });
});
