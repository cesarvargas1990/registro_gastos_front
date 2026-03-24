import { obtenerMesNombre } from '../src/utils/meses.js';

test('obtenerMesNombre retorna nombre correcto', () => {
  expect(obtenerMesNombre(2)).toBe('Febrero');
});

test('obtenerMesNombre retorna vacío para números inválidos', () => {
  expect(obtenerMesNombre(0)).toBe('');
  expect(obtenerMesNombre(13)).toBe('');
});
