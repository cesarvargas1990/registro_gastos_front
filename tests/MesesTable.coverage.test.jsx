import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

describe('MesesTable coverage', () => {
  it('renders table and months', async () => {
    render(<MesesTable />);
    expect(await screen.findByText('Meses del Año Actual')).toBeInTheDocument();
    expect(await screen.findByText('Enero')).toBeInTheDocument();
    expect(await screen.findByText('Febrero')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3); // header + 2 months
  });

  it('shows editable inputs and saves', async () => {
    render(<MesesTable />);
    const inputs = await screen.findAllByRole('spinbutton');
    expect(inputs.length).toBeGreaterThan(0);
    fireEvent.change(inputs[0], { target: { value: '9999999' } });
    const saveBtn = screen.getByText('Guardar cambios');
    fireEvent.click(saveBtn);
    await waitFor(() => expect(screen.getByText('Guardando...')).toBeInTheDocument());
  });

  it('shows empty state', async () => {
    jest.spyOn(require('axios'), 'get').mockResolvedValueOnce({ data: [] });
    render(<MesesTable />);
    expect(await screen.findByText('Sin datos para el año actual.')).toBeInTheDocument();
  });
});
