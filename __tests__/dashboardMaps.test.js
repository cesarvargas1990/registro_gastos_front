import { mapDashboardData } from '../utils/dashboardMaps.js';

test('mapDashboardData retorna objeto mapeado', () => {
  const data = { total: 100 };
  const mapped = mapDashboardData(data);
  expect(mapped).toHaveProperty('total');
});
