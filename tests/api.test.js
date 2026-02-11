import axios from 'axios';
import { API_BASE, getJson, postJson } from '../src/utils/api.js';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('api utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getJson retorna data y usa la URL base', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: 1 }] });

    const data = await getJson('/categorias');

    expect(axios.get).toHaveBeenCalledWith(`${API_BASE}/categorias`);
    expect(data).toEqual([{ id: 1 }]);
  });

  it('postJson retorna data y envía payload', async () => {
    const payload = { nombre: 'Test' };
    axios.post.mockResolvedValueOnce({ data: { ok: true } });

    const data = await postJson('/movimientos', payload);

    expect(axios.post).toHaveBeenCalledWith(`${API_BASE}/movimientos`, payload);
    expect(data).toEqual({ ok: true });
  });
});
