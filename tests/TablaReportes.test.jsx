import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TablaReportes from '../src/TablaReportes.jsx';
jest.mock('axios');

test('renderiza TablaReportes correctamente', () => {
  render(<TablaReportes />);
  expect(screen.getByText(/reporte de movimientos/i)).toBeInTheDocument();
});

test('permite filtrar por descripción', () => {
  render(<TablaReportes />);
  const input = screen.getByPlaceholderText(/filtrar por descripción/i);
  fireEvent.change(input, { target: { value: 'test' } });
  expect(input.value).toBe('test');
});

test('permite cambiar items por página', () => {
  render(<TablaReportes />);
  const select = screen.getByDisplayValue('20 por página');
  fireEvent.change(select, { target: { value: '10' } });
  expect(select.value).toBe('10');
});

test('permite limpiar filtros', () => {
  render(<TablaReportes />);
  const btn = screen.getByText(/limpiar filtros/i);
  fireEvent.click(btn);
  expect(screen.getByPlaceholderText(/filtrar por descripción/i).value).toBe('');
});
