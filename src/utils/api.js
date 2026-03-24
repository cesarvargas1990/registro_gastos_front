import axios from 'axios';

export const API_BASE = 'http://147.93.1.252:5000';

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
