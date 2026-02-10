import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard.jsx';
jest.mock('axios');

test('renderiza Dashboard correctamente', () => {
  render(<Dashboard />);
  // Verifica que al menos un elemento tenga el texto 'Total por Mes'
  expect(screen.getAllByText(/total por mes/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/ahorros y estimaciones/i)).toBeInTheDocument();
  expect(screen.getByText(/resumen de gastos fijos/i)).toBeInTheDocument();
});
