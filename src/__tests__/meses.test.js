import { obtenerMesNombre } from '../utils/meses.js';

test('obtenerMesNombre retorna nombre correcto', () => {
  expect(obtenerMesNombre(2)).toBe('Febrero');
});
