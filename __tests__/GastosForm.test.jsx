import { render, screen } from '@testing-library/react';
import GastosForm from '../GastosForm.jsx';

test('renderiza GastosForm correctamente', () => {
  render(<GastosForm />);
  expect(screen.getByText(/gastos/i)).toBeInTheDocument();
});
