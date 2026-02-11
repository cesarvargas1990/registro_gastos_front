import React from 'react';
import { render, screen } from '@testing-library/react';
import MesesTable from '../src/MesesTable.jsx';
jest.mock('axios', () => ({
  get: jest.fn(() =>
    Promise.resolve({
      data: [
        {
          id: 1,
          anio: 2026,
          numero_mes: 1,
          nombre: 'Enero',
          meta_ahorro: 1500000,
          ingreso_neto: 9305824,
          estimado_gastos_fijos: 4269637,
        },
        {
          id: 2,
          anio: 2026,
          numero_mes: 2,
          nombre: 'Febrero',
          meta_ahorro: 3000000,
          ingreso_neto: 9305824,
          estimado_gastos_fijos: 4269637,
        },
      ],
    })
  ),
  put: jest.fn(() => Promise.resolve()),
}));

describe('MesesTable', () => {
  it('renderiza MesesTable correctamente', async () => {
    render(<MesesTable />);
    expect(await screen.findByText('Meses del Año Actual')).toBeInTheDocument();
    expect(await screen.findByText('Enero')).toBeInTheDocument();
    expect(await screen.findByText('Febrero')).toBeInTheDocument();
    // Verifica inputs editables con valores numéricos
    expect(screen.getAllByDisplayValue('1500000').length).toBe(1);
    expect(screen.getAllByDisplayValue('3000000').length).toBe(1);
    expect(screen.getAllByDisplayValue('9305824').length).toBe(2);
    expect(screen.getAllByDisplayValue('4269637').length).toBe(2);
  });

  it('muestra inputs editables', async () => {
    render(<MesesTable />);
    const inputs = await screen.findAllByRole('spinbutton');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('muestra estado vacío', async () => {
    jest.spyOn(require('axios'), 'get').mockResolvedValueOnce({ data: [] });
    render(<MesesTable />);
    expect(await screen.findByText('Sin datos para el año actual.')).toBeInTheDocument();
  });
});
