import { formateaMoneda, formateaFecha } from '../utils/format.js';

test('formateaMoneda retorna string con $', () => {
  expect(formateaMoneda(100)).toBe('$100.00');
});

test('formateaFecha retorna fecha formateada', () => {
  expect(formateaFecha('2026-02-10')).toMatch(/10\/02\/2026/);
});
