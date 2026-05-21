import { MESES } from './meses.js';

export const formatCurrency = (value, options = {}) =>
  Number(value ?? 0).toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    ...options,
  });

export function formateaMoneda(valor) {
  const num = Math.round(Number(valor ?? 0));
  return '$ ' + num.toLocaleString('es-CO');
}

export function formateaFecha(fecha) {
  if (!fecha) return '';
  const d = new Date(fecha);
  return `${d.getUTCDate()}/${d.getUTCMonth() + 1}/${d.getUTCFullYear()}`;
}

export const toFiniteNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

export const hasFiniteNumber = (value) =>
  value !== null && value !== undefined && Number.isFinite(Number(value));

const hasFinancialFields = (row) =>
  [
    row.ingreso_real,
    row.meta_ahorro_est,
    row.gastos_fijos_real,
    row.gastos_fijos_est,
    row.gastos_adicionales,
  ].some(hasFiniteNumber);

export const calcularDisponibleGastos = (row) => {
  if (hasFiniteNumber(row.disponible_gastos)) return toFiniteNumber(row.disponible_gastos);
  if (hasFiniteNumber(row.disponible_gastos_real))
    return toFiniteNumber(row.disponible_gastos_real);
  if (hasFiniteNumber(row.disponible_despues_gastos)) {
    return toFiniteNumber(row.disponible_despues_gastos);
  }

  if (!hasFinancialFields(row)) {
    return toFiniteNumber(row.disp_desp_cump_meta);
  }

  return (
    toFiniteNumber(row.ingreso_real) -
    toFiniteNumber(row.meta_ahorro_est) -
    toFiniteNumber(row.gastos_fijos_est) -
    toFiniteNumber(row.gastos_adicionales)
  );
};

export const aplicarSaldoAcumuladoTrasMeta = (rows) => {
  let acumulado = 0;
  const saldosPorFila = new Map();

  [...rows]
    .sort((a, b) => MESES.indexOf(a.mes) - MESES.indexOf(b.mes))
    .forEach((row) => {
      acumulado += calcularDisponibleGastos(row);
      saldosPorFila.set(row, acumulado);
    });

  return rows.map((row) => ({
    ...row,
    disp_desp_cump_meta: saldosPorFila.get(row),
  }));
};
