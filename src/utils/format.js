export function formateaMoneda(value) {
  // Format as $X.XXX.XXX with no decimals, using thousands separator
  const num = Number(value ?? 0);
  return `$ ${num.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export const formatCurrency = formateaMoneda;

export function formateaFecha(fecha) {
  // Parse date string as UTC to avoid timezone offset
  const [year, month, day] = fecha.split('-');
  return `${parseInt(day, 10)}/${parseInt(month, 10)}/${year}`;
}
