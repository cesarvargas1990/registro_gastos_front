import axios from 'axios';
import { clearAuthToken, getJson, loginUser, postJson, setAuthToken } from '../src/utils/api.js';

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
  const requestInterceptor = axios.interceptors.request.use.mock.calls[0][0];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('getJson retorna data y usa la URL base', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: 1 }] });

    const data = await getJson('/categorias');

    expect(axios.get).toHaveBeenCalledWith('/categorias', undefined);
    expect(data).toEqual([{ id: 1 }]);
  });

  it('getJson y postJson aceptan config adicional', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockResolvedValueOnce({ data: { ok: true } });
    const config = { params: { anio: 2026 } };

    await getJson('/meses', config);
    await postJson('/movimientos', { valor: 1 }, config);

    expect(axios.get).toHaveBeenCalledWith('/meses', config);
    expect(axios.post).toHaveBeenCalledWith('/movimientos', { valor: 1 }, config);
  });

  it('postJson retorna data y envía payload', async () => {
    const payload = { nombre: 'Test' };
    axios.post.mockResolvedValueOnce({ data: { ok: true } });

    const data = await postJson('/movimientos', payload);

    expect(axios.post).toHaveBeenCalledWith('/movimientos', payload, undefined);
    expect(data).toEqual({ ok: true });
  });

  it('agrega Authorization cuando existe token', () => {
    setAuthToken('jwt-auth');

    const config = requestInterceptor({ headers: {} });

    expect(config.headers.Authorization).toBe('Bearer jwt-auth');
  });

  it('no agrega Authorization cuando no existe token', () => {
    clearAuthToken();

    const config = requestInterceptor({});

    expect(config.headers).toBeUndefined();
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

  it('loginUser acepta access_token como formato alterno', async () => {
    axios.post.mockResolvedValueOnce({ data: { access_token: 'alt-token' } });

    const token = await loginUser('admin@mail.com', '123456');

    expect(token).toBe('alt-token');
    expect(localStorage.getItem('authToken')).toBe('alt-token');
  });

  it('loginUser falla si backend no retorna token', async () => {
    axios.post.mockResolvedValueOnce({ data: { ok: true } });

    await expect(loginUser('admin@mail.com', '123456')).rejects.toThrow(
      'No se recibió token en la respuesta de autenticación'
    );
  });
});
