import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import TablaReportes from '../src/TablaReportes.jsx';

jest.mock('axios', () => ({
  get: jest.fn(),
  delete: jest.fn(),
}));

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

jest.mock('../src/GastosForm.jsx', () => ({
  __esModule: true,
  default: ({ onClose, onSuccess }) => (
    <div data-testid="mock-gastosform">
      <button onClick={onClose}>Cerrar</button>
      <button onClick={onSuccess}>GuardarEdicion</button>
    </div>
  ),
}));

const getData = () => [
  {
    id: 1,
    descripcion: 'Ingreso A',
    valor: 500,
    fecha: '2026-01-01',
    nombre_categoria: 'Ingreso',
    categoria_id: 1,
    fecha_final_pago: '2026-01-05',
  },
  {
    id: 2,
    descripcion: 'Gasto B',
    valor: 500,
    fecha: '2026-03-15',
    nombre_categoria: 'Gasto',
    categoria_id: 2,
    fecha_final_pago: null,
  },
];

describe('TablaReportes more coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: getData() });
    axios.delete.mockResolvedValue({});
  });

  it('maneja error en carga de movimientos', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('load fail'));

    render(<TablaReportes />);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith('Error cargando movimientos:', expect.any(Error));
    });
    errorSpy.mockRestore();
  });

  it('aplica filtros de fecha, limpia filtros y alterna orden en misma columna', async () => {
    render(<TablaReportes />);
    expect(await screen.findByText('Ingreso A')).toBeInTheDocument();
    expect(screen.getByText('Gasto B')).toBeInTheDocument();

    const dateInputs = document.querySelectorAll('input[type="date"]');
    fireEvent.change(dateInputs[0], { target: { value: '2026-03-01' } });
    fireEvent.change(dateInputs[1], { target: { value: '2026-03-31' } });

    await waitFor(() => {
      expect(screen.queryByText('Ingreso A')).not.toBeInTheDocument();
      expect(screen.getByText('Gasto B')).toBeInTheDocument();
    });

    const idHeader = screen.getByText(/id/i);
    fireEvent.click(idHeader);
    expect(screen.getByText(/id ↓/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Limpiar filtros'));
    await waitFor(() => {
      expect(screen.getByText('Ingreso A')).toBeInTheDocument();
      expect(screen.getByText('Gasto B')).toBeInTheDocument();
    });
  });

  it('permite cancelar modal de eliminar y maneja error al eliminar', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.delete.mockRejectedValueOnce(new Error('delete fail'));

    render(<TablaReportes />);
    const deleteBtns = await screen.findAllByTitle('Eliminar');

    fireEvent.click(deleteBtns[0]);
    expect(await screen.findByText('¿Eliminar este gasto?')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancelar'));
    expect(screen.queryByText('¿Eliminar este gasto?')).not.toBeInTheDocument();

    fireEvent.click(deleteBtns[0]);
    const confirmBtn = await screen.findByText('Eliminar');
    await act(async () => {
      fireEvent.click(confirmBtn);
    });

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith('Error al eliminar:', expect.any(Error));
    });
    errorSpy.mockRestore();
  });

  it('ejecuta onSuccess del modal de edición y recarga movimientos', async () => {
    render(<TablaReportes />);
    const editBtns = await screen.findAllByTitle('Editar');
    fireEvent.click(editBtns[0]);

    expect(await screen.findByTestId('mock-gastosform')).toBeInTheDocument();
    fireEvent.click(screen.getByText('GuardarEdicion'));

    await waitFor(() => {
      expect(screen.queryByTestId('mock-gastosform')).not.toBeInTheDocument();
    });
    expect(axios.get).toHaveBeenCalledTimes(2);
  });
});
