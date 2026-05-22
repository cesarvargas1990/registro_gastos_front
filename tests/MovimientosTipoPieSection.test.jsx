import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MovimientosTipoPieSection from '../src/components/dashboard/MovimientosTipoPieSection.jsx';
import { getJson } from '../src/utils/api.js';

jest.mock('../src/utils/api.js', () => ({
  getJson: jest.fn(),
}));

jest.mock('react-chartjs-2', () => ({
  Pie: () => <div>Pie chart mock</div>,
}));

const baseResponses = {
  '/anios-movimientos': [{ anio: 2026 }, { anio: 2025 }],
  '/categorias': [
    { id: 1, nombre: 'Ingreso' },
    { id: 2, nombre: 'Gasto' },
  ],
  '/movimientos-por-tipo': [
    { tipo_movimiento_id: 1, tipo_movimiento: 'Alimentación', total_valor: 100000 },
    { tipo_movimiento_id: 3, tipo_movimiento: 'Gimnasio y deporte', total_valor: 50000 },
  ],
};

describe('MovimientosTipoPieSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getJson.mockImplementation((url) => Promise.resolve(baseResponses[url] || []));
  });

  it('renderiza filtros, grafica y tabla de tipos', async () => {
    render(<MovimientosTipoPieSection />);

    expect(screen.getByText(/movimientos por tipo/i)).toBeInTheDocument();

    expect(await screen.findByText('Alimentación')).toBeInTheDocument();
    expect(screen.getByText('Gimnasio y deporte')).toBeInTheDocument();
    expect(screen.getByText('Pie chart mock')).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.replace(/\s/g, ' ') === '$ 100.000,00')
    ).toBeInTheDocument();
  });

  it('consulta de nuevo al cambiar la categoria', async () => {
    render(<MovimientosTipoPieSection />);

    await waitFor(() => {
      expect(getJson).toHaveBeenCalledWith(
        '/movimientos-por-tipo',
        expect.objectContaining({
          params: expect.objectContaining({ categoria_id: '2' }),
        })
      );
    });

    fireEvent.change(screen.getByDisplayValue('Gasto'), { target: { value: '1' } });

    await waitFor(() => {
      expect(getJson).toHaveBeenCalledWith(
        '/movimientos-por-tipo',
        expect.objectContaining({
          params: expect.objectContaining({ categoria_id: '1' }),
        })
      );
    });
  });
});
