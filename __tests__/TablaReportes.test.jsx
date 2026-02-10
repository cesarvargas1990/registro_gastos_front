import { render, screen } from '@testing-library/react';
import TablaReportes from '../TablaReportes.jsx';

test('renderiza TablaReportes correctamente', () => {
  render(<TablaReportes />);
  expect(screen.getByText(/reportes/i)).toBeInTheDocument();
});
