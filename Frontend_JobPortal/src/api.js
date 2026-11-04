import axios from 'axios';
const configured = process.env.REACT_APP_API_BASE_URL;
export const API_BASE_URL = (configured || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080')).replace(/\/$/, '');
if (!API_BASE_URL) throw new Error('REACT_APP_API_BASE_URL is required for production');
const api = axios.create({ baseURL: API_BASE_URL, timeout: 90000, headers: { 'X-Requested-With': 'XMLHttpRequest' } });
export default api;
