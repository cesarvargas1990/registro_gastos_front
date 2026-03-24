import { formatCurrency, formateaMoneda, formateaFecha } from '../src/utils/format.js';

test('formateaMoneda retorna string con $ y separador de miles', () => {
  expect(formateaMoneda(9305824)).toBe('$ 9.305.824');
  expect(formateaMoneda(1500000)).toBe('$ 1.500.000');
  expect(formateaMoneda(0)).toBe('$ 0');
  expect(formateaMoneda(null)).toBe('$ 0');
});

test('formateaMoneda retorna formato con decimales si se requiere', () => {
  // El formato actual no muestra decimales, pero si se cambia la función, este test lo detecta
  expect(formateaMoneda(1234567.89)).toBe('$ 1.234.568'); // Redondea
});

test('formateaFecha retorna fecha formateada', () => {
  expect(formateaFecha('2026-02-10')).toBe('10/2/2026');
});

test('formateaFecha retorna vacío cuando no recibe fecha', () => {
  expect(formateaFecha()).toBe('');
  expect(formateaFecha(null)).toBe('');
});

test('formatCurrency permite sobrescribir opciones', () => {
  expect(formatCurrency(1500, { maximumFractionDigits: 0 })).toContain('$ 1.500');
});
