import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Transaction APIs
export const getTransactions = (page = 1, limit = 50) => 
  api.get('/transactions', { params: { page, limit } });
export const uploadTransactionCSV = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/transactions/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const getTransactionStats = () => api.get('/transactions/stats');

// Account APIs
export const getAccounts = () => api.get('/accounts');
export const uploadAccountCSV = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/accounts/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const getAccountSummary = () => api.get('/accounts/summary');

export default api;
