import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Dashboard from '../src/Dashboard.jsx';
jest.mock('axios');
jest.mock('../src/utils/api.js', () => ({
  getJson: jest.fn(() => Promise.resolve([])),
  postJson: jest.fn(() => Promise.resolve()),
}));
jest.mock('chart.js', () => ({
  Chart: {
    register: () => {},
  },
  CategoryScale: {},
  LinearScale: {},
  BarElement: {},
  PointElement: {},
  LineElement: {},
  Title: {},
  Tooltip: {},
  Legend: {},
}));
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div>Bar chart mock</div>,
  Line: () => <div>Line chart mock</div>,
}));

test('renderiza Dashboard correctamente', async () => {
  await act(async () => {
    render(<Dashboard />);
  });
  // Verifica que al menos un elemento tenga el texto 'Total por Mes'
  expect(screen.getAllByText(/total por mes/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/ahorros y estimaciones/i)).toBeInTheDocument();
  expect(screen.getByText(/resumen de gastos fijos/i)).toBeInTheDocument();
});
