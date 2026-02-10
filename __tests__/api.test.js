import { fetchData } from '../utils/api.js';
jest.mock('../utils/api.js', () => ({
  fetchData: jest.fn(() => Promise.resolve({ success: true }))
}));

test('fetchData retorna datos simulados', async () => {
  const result = await fetchData();
  expect(result.success).toBe(true);
});
