const DEFAULT_API_BASE_URL = 'http://localhost:8080';

const rawApiBaseUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.REACT_APP_API_URL ||
  DEFAULT_API_BASE_URL;

export const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, '');
