import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TablaReportes from '../src/TablaReportes.jsx';

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [
    {
      id: 1,
      descripcion: 'Test Desc',
      valor: 1234567,
      fecha: '2026-01-01',
      nombre_categoria: 'Ingreso',
      categoria_id: 1,
      fecha_final_pago: '2026-01-10',
    },
    {
      id: 2,
      descripcion: 'Otro Desc',
      valor: 7654321,
      fecha: '2026-02-01',
      nombre_categoria: 'Gasto',
      categoria_id: 2,
      fecha_final_pago: '2026-02-10',
    },
  ]})),
  delete: jest.fn(() => Promise.resolve()),
}));

// FiltroCategorias mock
jest.mock('../src/FiltroCategorias.jsx', () => ({
  __esModule: true,
  default: ({ onChange }) => (
    <select data-testid="mock-filtro" onChange={e => onChange(e.target.value)}>
      <option value="">Todas</option>
      <option value="1">Ingreso</option>
      <option value="2">Gasto</option>
    </select>
  ),
}));

// GastosForm mock
jest.mock('../src/GastosForm.jsx', () => ({
  __esModule: true,
  default: ({ onClose }) => (
    <div data-testid="mock-gastosform">
      <button onClick={onClose}>Cerrar</button>
    </div>
  ),
}));

describe('TablaReportes coverage', () => {
  it('renders table and totals', async () => {
    render(<TablaReportes />);
    expect(await screen.findByText('Reporte de Movimientos')).toBeInTheDocument();
    expect(await screen.findByText('Test Desc')).toBeInTheDocument();
    expect(await screen.findByText('Otro Desc')).toBeInTheDocument();
    expect(screen.getByText('$1.234.567')).toBeInTheDocument();
    expect(screen.getByText('$7.654.321')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('filters by categoria', async () => {
    render(<TablaReportes />);
    const filtro = await screen.findByTestId('mock-filtro');
    fireEvent.change(filtro, { target: { value: '1' } });
    expect(await screen.findByText('Test Desc')).toBeInTheDocument();
    expect(screen.queryByText('Otro Desc')).not.toBeInTheDocument();
  });

  it('shows and closes edit modal', async () => {
    render(<TablaReportes />);
    const editBtn = await screen.findAllByTitle('Editar');
    fireEvent.click(editBtn[0]);
    expect(screen.getByTestId('mock-gastosform')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cerrar'));
    expect(screen.queryByTestId('mock-gastosform')).not.toBeInTheDocument();
  });

  it('shows and closes delete modal', async () => {
    render(<TablaReportes />);
    const deleteBtn = await screen.findAllByTitle('Eliminar');
    fireEvent.click(deleteBtn[0]);
    expect(screen.getByText('¿Eliminar este gasto?')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancelar'));
    expect(screen.queryByText('¿Eliminar este gasto?')).not.toBeInTheDocument();
  });
});
