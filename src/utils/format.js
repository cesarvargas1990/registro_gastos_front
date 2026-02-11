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
