import axios from 'axios';

const LOCAL_API_BASE = '//localhost:5000';
const REMOTE_API_BASE = '//147.93.1.252:5000';

const resolveApiBase = () => {
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return process.env.REACT_APP_API_BASE || LOCAL_API_BASE;
    }

    // Never send a browser running on the deployed host to its own localhost.
    // CRA embeds REACT_APP_API_BASE at build time, so the old localhost value
    // must yield to the host serving the frontend in remote environments.
    if (!process.env.REACT_APP_API_BASE || process.env.REACT_APP_API_BASE === LOCAL_API_BASE) {
      return `//${hostname}:5000`;
    }

    return process.env.REACT_APP_API_BASE;
  }

  return process.env.REACT_APP_API_BASE || REMOTE_API_BASE;
};

export const API_BASE = resolveApiBase();

const AUTH_TOKEN_KEY = 'authToken';

axios.defaults.baseURL = API_BASE;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token) => localStorage.setItem(AUTH_TOKEN_KEY, token);

export const clearAuthToken = () => localStorage.removeItem(AUTH_TOKEN_KEY);

const extractToken = (data) =>
  data?.token ?? data?.access_token ?? data?.accessToken ?? data?.jwt ?? null;

export const loginUser = async (username, password) => {
  const response = await axios.post('/auth/login', {
    username,
    password,
  });

  const token = extractToken(response.data);

  if (!token) {
    throw new Error('No se recibió token en la respuesta de autenticación');
  }

  setAuthToken(token);
  return token;
};

export const getJson = (path, config) => axios.get(path, config).then((res) => res.data);

export const postJson = (path, payload, config) =>
  axios.post(path, payload, config).then((res) => res.data);
