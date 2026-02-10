export function formateaMoneda(value) {
  return `$${Number(value ?? 0).toFixed(2)}`;
}

// Alias for compatibility with dashboard components
export const formatCurrency = formateaMoneda;

export function formateaFecha(fecha) {
  const d = new Date(fecha);
  return d.toLocaleDateString('es-CO');
}
