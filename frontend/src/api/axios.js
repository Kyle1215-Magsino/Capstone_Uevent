import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

let csrfFetched = false;

const fetchCsrf = async () => {
  if (!csrfFetched) {
    await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
    csrfFetched = true;
  }
};

api.interceptors.request.use(async (config) => {
  if (['post', 'put', 'delete', 'patch'].includes(config.method)) {
    await fetchCsrf();
    const xsrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='));
    if (xsrfToken) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken.substring('XSRF-TOKEN='.length));
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If CSRF token mismatch (419), refetch cookie and retry once
    if (error.response?.status === 419 && !originalRequest._retried) {
      originalRequest._retried = true;
      csrfFetched = false;
      await fetchCsrf();
      const xsrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='));
      if (xsrfToken) {
        originalRequest.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken.substring('XSRF-TOKEN='.length));
      }
      return api(originalRequest);
    }
    if (error.response?.status === 401) {
      if (window.location.pathname !== '/' && !window.location.pathname.startsWith('/student')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
