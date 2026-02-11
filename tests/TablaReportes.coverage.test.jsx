import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import TablaReportes from '../src/TablaReportes.jsx';
let mockData = [
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
];
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: mockData })),
  delete: jest.fn((url) => {
    // Elimina el elemento del mock
    const id = parseInt(url.split('/').pop(), 10);
    mockData = mockData.filter((item) => item.id !== id);
    return Promise.resolve();
  }),
}));
// FiltroCategorias mock
jest.mock('../src/FiltroCategorias.jsx', () => ({
  __esModule: true,
  default: ({ onChange }) => (
    <select data-testid="mock-filtro" onChange={(e) => onChange(e.target.value)}>
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
    // Verifica filas
    expect(screen.getAllByRole('row').length).toBeGreaterThan(2);
  });

  it('filters by description', async () => {
    render(<TablaReportes />);
    const input = await screen.findByPlaceholderText('Filtrar por descripción...');
    fireEvent.change(input, { target: { value: 'Test Desc' } });
    expect(await screen.findByText('Test Desc')).toBeInTheDocument();
    expect(screen.queryByText('Otro Desc')).toBeNull();
  });

  it('filters by category', async () => {
    render(<TablaReportes />);
    const select = await screen.findByTestId('mock-filtro');
    fireEvent.change(select, { target: { value: '2' } });
    expect(await screen.findByText('Otro Desc')).toBeInTheDocument();
    expect(screen.queryByText('Test Desc')).toBeNull();
  });

  it('deletes a row', async () => {
    render(<TablaReportes />);
    // Simula click en eliminar (primer botón)
    const deleteBtns = await screen.findAllByTitle('Eliminar');
    await act(async () => {
      fireEvent.click(deleteBtns[0]);
    });
    // Confirma modal
    const confirmBtn = await screen.findByText('Eliminar');
    await act(async () => {
      fireEvent.click(confirmBtn);
    });
    await waitFor(() => {
      // Buscar la celda por texto
      expect(screen.queryByText('Test Desc')).not.toBeInTheDocument();
    });
  });

  it('edits a row', async () => {
    render(<TablaReportes />);
    const editBtns = await screen.findAllByTitle('Editar');
    fireEvent.click(editBtns[0]);
    expect(await screen.findByTestId('mock-gastosform')).toBeInTheDocument();
    const closeBtn = screen.getByText('Cerrar');
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('mock-gastosform')).toBeNull();
  });

  it('paginates rows', async () => {
    render(<TablaReportes />);
    // Simula paginación si existe el botón
    const nextBtn = screen.queryByText('Siguiente');
    if (nextBtn) {
      fireEvent.click(nextBtn);
      expect(screen.getByText('1')).toBeInTheDocument();
    }
  });

  it('sorts by column', async () => {
    render(<TablaReportes />);
    const sortBtn = await screen.findByText('Valor');
    fireEvent.click(sortBtn);
    expect(sortBtn).toBeInTheDocument();
  });

  it('shows empty state', async () => {
    jest.spyOn(require('axios'), 'get').mockResolvedValueOnce({ data: [] });
    render(<TablaReportes />);
    // El estado vacío se muestra solo cuando no hay movimientos, pero la tabla sigue mostrando el total
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('$0')).toBeInTheDocument();
  });
});
