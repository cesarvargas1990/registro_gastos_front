import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import FlujoCaja from '../src/FlujoCaja.jsx';

jest.mock('axios', () => ({
  get: jest.fn(),
  put: jest.fn(),
  defaults: {},
  interceptors: { request: { use: jest.fn() } },
}));

const data = {
  entradas: [{ id: 1, concepto: 'tengo efectivo', valor: 1000, orden: 1 }],
  parametros: { cuenta_bolsillo: 5000, meta: 10000, est_prest_serv: 200 },
  meses: [
    { anio: 2026, mes: 11, nombre: 'Noviembre' },
    { anio: 2026, mes: 12, nombre: 'Diciembre' },
  ],
  gastos_fijos: [
    {
      gasto_fijo_id: 3,
      descripcion: 'Casa',
      valor_base: 400,
      meses: [
        { anio: 2026, mes: 11, valor: 400, seleccionado: false },
        { anio: 2026, mes: 12, valor: 400, seleccionado: false },
      ],
    },
  ],
};

describe('FlujoCaja', () => {
  beforeEach(() => {
    axios.get.mockReset().mockResolvedValue({ data });
    axios.put.mockReset().mockResolvedValue({ data: { message: 'ok' } });
  });

  it('renderiza, recalcula en vivo y guarda', async () => {
    render(<FlujoCaja />);
    await screen.findByText('Casa');
    expect(screen.getByText('Noviembre')).toBeTruthy();
    expect(screen.getByText('Diciembre')).toBeTruthy();

    fireEvent.click(screen.getByLabelText('Casa Noviembre seleccionado'));
    // posible = 5000 + 1000 - 400 + 200 = 5800; dif = -4200
    await waitFor(() =>
      expect(screen.getByTestId('posible_gran_total').textContent).toMatch(/5\.800/)
    );
    expect(screen.getByTestId('dif_meta').textContent).toMatch(/4\.200/);
    expect(screen.getByTestId('dif_meta').className).toMatch(/text-red-600/);
    expect(screen.getByTestId('total-gf').textContent).toMatch(/400/);

    fireEvent.click(screen.getByText('Agregar fila'));
    fireEvent.change(screen.getByLabelText('Valor 2'), { target: { value: '500' } });
    expect(screen.getByTestId('total-entra').textContent).toMatch(/1\.500/);

    fireEvent.click(screen.getByText('Guardar'));
    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));
    const [url, body] = axios.put.mock.calls[0];
    expect(url).toMatch(/\/flujo-caja$/);
    expect(body.entradas).toEqual([
      { concepto: 'tengo efectivo', valor: 1000 },
      { concepto: '', valor: 500 },
    ]);
    expect(body.parametros).toEqual({ cuenta_bolsillo: 5000, meta: 10000, est_prest_serv: 200 });
    expect(body.gastos_fijos).toContainEqual({
      gasto_fijo_id: 3,
      anio: 2026,
      mes: 11,
      valor: 400,
      seleccionado: true,
    });
    await screen.findByText('Flujo de caja guardado.');
  });

  it('no guarda al cargar y autoguarda tras editar', async () => {
    render(<FlujoCaja />);
    await screen.findByText('Casa');
    await new Promise((r) => setTimeout(r, 1000));
    expect(axios.put).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText('Valor 1'), { target: { value: '777' } });
    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1), { timeout: 3000 });
    expect(axios.put.mock.calls[0][1].entradas[0].valor).toBe(777);
  });

  it('muestra el error del backend al fallar el guardado', async () => {
    axios.put.mockRejectedValue({ response: { data: { error: 'inválido' } } });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<FlujoCaja />);
    await screen.findByText('Casa');
    fireEvent.click(screen.getByText('Guardar'));
    await screen.findByText('inválido');
  });
});
