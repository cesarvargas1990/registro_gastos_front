import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard.jsx';

test('renderiza Dashboard correctamente', () => {
  render(<Dashboard />);
  expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
});
