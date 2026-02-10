import { render, screen } from '@testing-library/react';
import Login from '../Login.jsx';

test('renderiza Login correctamente', () => {
  render(<Login />);
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});
