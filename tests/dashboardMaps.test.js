import dashboardMaps from '../src/utils/dashboardMaps.js';

test('mapDashboardData retorna objeto mapeado', () => {
  const data = { total: 100 };
  const mapped = dashboardMaps(data);
  expect(mapped).toHaveProperty('total');
});
