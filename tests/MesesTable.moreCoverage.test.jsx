import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MesesTable from '../src/MesesTable.jsx';

jest.mock('axios', () => ({
  get: jest.fn(),
  put: jest.fn(),
}));

const mesesMock = [
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
];

describe('MesesTable more coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: mesesMock });
    axios.put.mockResolvedValue({});
  });

  it('deshabilita guardar cuando no hay cambios y lo habilita al editar', async () => {
    render(<MesesTable />);
    const saveBtn = await screen.findByText('Guardar cambios');
    expect(saveBtn).toBeDisabled();

    const inputs = await screen.findAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '9999999' } });
    expect(saveBtn).not.toBeDisabled();
  });

  it('muestra error cuando falla la carga inicial', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('load fail'));

    render(<MesesTable />);

    expect(await screen.findByText('Error al cargar los meses.')).toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalledWith('Error cargando meses:', expect.any(Error));
    errorSpy.mockRestore();
  });

  it('guarda cambios y envía null cuando el dato inicial viene vacío', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          ...mesesMock[0],
          meta_ahorro: null,
        },
        mesesMock[1],
      ],
    });
    render(<MesesTable />);
    const inputs = await screen.findAllByRole('spinbutton');

    fireEvent.change(inputs[1], { target: { value: '9305000' } });
    const saveBtn = screen.getByText('Guardar cambios');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
    });
    expect(axios.put).toHaveBeenCalledWith(
      'http://147.93.1.252:5000/meses',
      expect.objectContaining({
        meses: expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            meta_ahorro: null,
          }),
        ]),
      })
    );
    expect(axios.get).toHaveBeenCalledTimes(2);
  });

  it('muestra error cuando falla guardar cambios', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.put.mockRejectedValueOnce(new Error('save fail'));

    render(<MesesTable />);
    const inputs = await screen.findAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '777' } });
    fireEvent.click(screen.getByText('Guardar cambios'));

    expect(await screen.findByText('Error al guardar los cambios.')).toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalledWith('Error guardando meses:', expect.any(Error));
    errorSpy.mockRestore();
  });
});
