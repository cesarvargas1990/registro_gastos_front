import axios from 'axios';

export const API_BASE = 'http://147.93.1.252:5000';

export const getJson = (path) => axios.get(`${API_BASE}${path}`).then((res) => res.data);

export const postJson = (path, payload) =>
  axios.post(`${API_BASE}${path}`, payload).then((res) => res.data);
