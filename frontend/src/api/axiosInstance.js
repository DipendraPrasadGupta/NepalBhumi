import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://nepalbhumi.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    
    // Always add token if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.debug(`[API] Adding token to request: ${config.method?.toUpperCase()} ${config.url}`);
    } else {
      console.warn(`[API] No token available for request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    // Don't set Content-Type for FormData - let browser handle it
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    console.error('[API] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    
    console.error(`[API] Response error ${status}:`, {
      url: originalRequest?.url,
      method: originalRequest?.method,
      message: error.response?.data?.message || error.message,
      hasToken: !!localStorage.getItem('accessToken'),
    });

    // Only retry 401 errors once, and only if we haven't already tried
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('[API] Got 401 - attempting token refresh...');

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          console.error('[API] No refresh token available - logging out');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/auth/login';
          return Promise.reject(error);
        }

        // Attempt to refresh the token
        const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        if (refreshResponse.data?.data?.accessToken) {
          const newAccessToken = refreshResponse.data.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          console.log('[API] Token refreshed successfully - retrying request');
          
          return api(originalRequest);
        } else {
          throw new Error('No access token in refresh response');
        }
      } catch (refreshError) {
        console.error('[API] Token refresh failed:', refreshError.message);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

export default api;
