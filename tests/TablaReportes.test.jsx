import React from 'react';
import { render, screen } from '@testing-library/react';
import TablaReportes from '../src/TablaReportes.jsx';
jest.mock('axios');

test('renderiza TablaReportes correctamente', () => {
  render(<TablaReportes />);
  expect(screen.getByText(/reporte de movimientos/i)).toBeInTheDocument();
});
