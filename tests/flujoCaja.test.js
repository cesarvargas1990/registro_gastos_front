import {
  calcularIndicadores,
  totalDineroEntra,
  totalGastosFijos,
  totalGastosFijosMes,
} from '../src/utils/flujoCaja';

describe('flujoCaja', () => {
  it('calcula indicadores con los números del Excel', () => {
    const r = calcularIndicadores({
      cuentaBolsillo: 14223493,
      meta: 24500000,
      estPrestServ: 6200000,
      totalEntra: 3750000,
      totalGastos: 1109741,
    });
    expect(r.falta_meta_total).toBe(10276507);
    expect(r.posible_gran_total).toBe(23063752);
    expect(r.dif_meta).toBe(-1436248);
    expect(r.bolsa).toBe(-1436248);
    expect(r.a_3_meses).toBeCloseTo(3425502.33, 2);
    expect(r.a_4_meses).toBeCloseTo(2569126.75, 2);
  });

  it('suma entradas tolerando valores inválidos', () => {
    expect(totalDineroEntra([{ valor: '100' }, { valor: 'x' }, { valor: 50 }])).toBe(150);
    expect(totalDineroEntra()).toBe(0);
  });

  it('suma gastos fijos seleccionados por mes y total', () => {
    const gf = [
      {
        meses: [
          { anio: 2026, mes: 11, valor: 100, seleccionado: true },
          { anio: 2026, mes: 12, valor: 200, seleccionado: false },
        ],
      },
      {
        meses: [
          { anio: 2026, mes: 11, valor: '50', seleccionado: true },
          { anio: 2026, mes: 12, valor: 70, seleccionado: true },
        ],
      },
    ];
    expect(totalGastosFijosMes(gf, 2026, 11)).toBe(150);
    expect(totalGastosFijosMes(gf, 2026, 12)).toBe(70);
    expect(totalGastosFijos(gf)).toBe(220);
  });
});
