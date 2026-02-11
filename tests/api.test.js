import api from '../src/utils/api.js';
jest.mock('../src/utils/api.js', () => ({
  fetchData: jest.fn(() => Promise.resolve({ success: true })),
}));

test('fetchData retorna datos simulados', async () => {
  const result = await api.fetchData();
  expect(result.success).toBe(true);
});
