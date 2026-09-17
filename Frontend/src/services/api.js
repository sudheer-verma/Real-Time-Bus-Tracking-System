const API_URL = import.meta.env.VITE_API_URL || 'https://real-time-bus-tracking-system-pgrr.onrender.com/api';

const normalizePath = (path) => {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
};

const getToken = () => localStorage.getItem('bus_token');

const request = async (path, options = {}) => {
  const { method = 'GET', body, headers = {}, auth = true, ...rest } = options;
  const token = getToken();

  const config = {
    method,
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (auth && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined && body !== null) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${normalizePath(path)}`, config);
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.message || 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return typeof data === 'string' ? { message: data } : data;
};

export const api = {
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options = {}) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options = {}) => request(path, { ...options, method: 'PATCH', body }),
  del: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
};

export default api;
