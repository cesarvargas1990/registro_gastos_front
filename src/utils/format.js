

export function formateaMoneda(value) {
  return `$${Number(value ?? 0).toFixed(2)}`;
}

export const formatCurrency = formateaMoneda;


export function formateaFecha(fecha) {
  // Parse date string as UTC to avoid timezone offset
  const [year, month, day] = fecha.split('-');
  return `${parseInt(day, 10)}/${parseInt(month, 10)}/${year}`;
}
