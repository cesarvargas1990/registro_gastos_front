import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import useDashboardData from '../src/hooks/useDashboardData.js';
import { getJson, postJson } from '../src/utils/api.js';

jest.mock('../src/utils/api.js', () => ({
  getJson: jest.fn(),
  postJson: jest.fn(),
}));

const baseResponses = {
  '/resumen-mensual': [{ Mes: 'Enero', valor: 100 }],
  '/resumen-gastos': [{ Mes: 'Enero', valor: 200 }],
  '/resumen-gastos-mensual': [{ Mes: 'Enero', valor: 300 }],
  '/dashboard-dinamico': [{ actual_en_cuenta_ahorros: 1000, ahorro_real: 500 }],
  '/resumen_estimado_vs_real': [{ Mes: 'Enero', estimado: 100, real: 90 }],
  '/totales-por-categoria': [{ categoria: 'Test', total: 100 }],
  '/resumen-categorias-mensual': [{ Mes: 'Enero', Test: 100 }],
};

const setGetJsonImplementation = (overrides = {}) => {
  getJson.mockImplementation((url) => {
    const override = overrides[url];
    if (override) return override();
    return Promise.resolve(baseResponses[url] ?? []);
  });
};

describe('useDashboardData coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setGetJsonImplementation();
    postJson.mockResolvedValue({});
    window.alert = jest.fn();
  });

  it('fetches dashboard data and exposes state', async () => {
    const { result } = renderHook(() => useDashboardData());

    await waitFor(() => {
      expect(result.current.resumenMensual[0].Mes).toBe('Enero');
    });

    expect(result.current.resumenGastos[0].valor).toBe(200);
    expect(result.current.resumenTabla[0].valor).toBe(300);
    expect(result.current.indicadoresDerivados[0].actual_menos_ahorro_real).toBe(500);
    expect(result.current.resumenRealVsEstimado[0].real).toBe(90);
    expect(result.current.totalesCategoria[0].total).toBe(100);
    expect(result.current.datos.length).toBeGreaterThan(0);
    expect(result.current.columnas.includes('Mes')).toBe(true);
  });

  it('keeps datos y columnas vacías si resumen categorias mensual llega vacío', async () => {
    setGetJsonImplementation({
      '/resumen-categorias-mensual': () => Promise.resolve([]),
    });

    const { result } = renderHook(() => useDashboardData());

    await waitFor(() => {
      expect(result.current.resumenMensual.length).toBe(1);
    });

    expect(result.current.datos).toEqual([]);
    expect(result.current.columnas).toEqual([]);
  });

  it('logs errores al obtener totales y resumen categorias', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    setGetJsonImplementation({
      '/totales-por-categoria': () => Promise.reject(new Error('totales fail')),
      '/resumen-categorias-mensual': () => Promise.reject(new Error('categorias fail')),
    });

    renderHook(() => useDashboardData());

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith(
        'Error al obtener totales por categoría',
        expect.any(Error)
      );
      expect(errorSpy).toHaveBeenCalledWith('Error al cargar datos:', expect.any(Error));
    });

    errorSpy.mockRestore();
  });

  it('handleGastoFijoToggle registers movement y refresca data', async () => {
    const { result } = renderHook(() => useDashboardData());

    await waitFor(() => {
      expect(result.current.resumenMensual.length).toBe(1);
    });

    act(() => {
      result.current.handleGastoFijoToggle(
        {
          Descripción: 'Test',
          Valor: 100,
          id: 1,
          categoria_id: 2,
        },
        'Enero'
      );
    });

    await waitFor(() => {
      expect(postJson).toHaveBeenCalledWith('/movimientos', expect.any(Object));
    });
    expect(getJson).toHaveBeenCalledWith('/resumen-mensual');
  });

  it('handleGastoFijoToggle alerta si postJson falla', async () => {
    postJson.mockRejectedValueOnce(new Error('post fail'));
    const { result } = renderHook(() => useDashboardData());

    await waitFor(() => {
      expect(result.current.resumenMensual.length).toBe(1);
    });

    act(() => {
      result.current.handleGastoFijoToggle(
        {
          Descripción: 'Test',
          Valor: 100,
          id: 1,
          categoria_id: 2,
        },
        'Enero'
      );
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Error al registrar el movimiento');
    });
  });

  it('handleGastoFijoToggle alerta si ya estaba registrado', async () => {
    const { result } = renderHook(() => useDashboardData());

    await waitFor(() => {
      expect(result.current.resumenMensual.length).toBe(1);
    });

    act(() => {
      result.current.handleGastoFijoToggle(
        {
          Descripción: 'Test',
          Valor: 100,
          id: 1,
          categoria_id: 2,
          Enero: 123,
        },
        'Enero'
      );
    });

    expect(window.alert).toHaveBeenCalledWith('Ya fue registrado este gasto');
  });
});
