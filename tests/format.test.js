import { formateaMoneda, formateaFecha } from '../src/utils/format.js';

test('formateaMoneda retorna string con $', () => {
  expect(formateaMoneda(100)).toBe('$ 100');
});

test('formateaFecha retorna fecha formateada', () => {
  expect(formateaFecha('2026-02-10')).toBe('10/2/2026');
});
