import axios from 'axios';

// Usa a vari�vel de ambiente ou localhost como fallback
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
});

// Interceptor para adicionar token em todas as requisi��es
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
