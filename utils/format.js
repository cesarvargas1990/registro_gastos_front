export const formatCurrency = (value, options = {}) =>
  Number(value ?? 0).toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    ...options,
  });
