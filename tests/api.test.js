import axios from 'axios';
import { API_BASE, getJson, postJson, loginUser } from '../src/utils/api.js';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  defaults: {},
  interceptors: {
    request: {
      use: jest.fn(),
    },
  },
}));

describe('api utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getJson retorna data y usa la URL base', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: 1 }] });

    const data = await getJson('/categorias');

    expect(axios.get).toHaveBeenCalledWith('/categorias', undefined);
    expect(data).toEqual([{ id: 1 }]);
  });

  it('postJson retorna data y envía payload', async () => {
    const payload = { nombre: 'Test' };
    axios.post.mockResolvedValueOnce({ data: { ok: true } });

    const data = await postJson('/movimientos', payload);

    expect(axios.post).toHaveBeenCalledWith('/movimientos', payload, undefined);
    expect(data).toEqual({ ok: true });
  });

  it('loginUser guarda y retorna el token', async () => {
    axios.post.mockResolvedValueOnce({ data: { token: 'jwt-token' } });

    const token = await loginUser('admin@mail.com', '123456');

    expect(axios.post).toHaveBeenCalledWith('/auth/login', {
      username: 'admin@mail.com',
      password: '123456',
    });
    expect(token).toBe('jwt-token');
    expect(localStorage.getItem('authToken')).toBe('jwt-token');
  });
});
