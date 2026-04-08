import axios from 'axios';
import { requestQueue } from '../utils/requestQueue';
import { ERROR_MESSAGES } from '../constants/errorMessages';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: 'https://ai-powered-resume-analyzer-weax.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 90000, // 90 seconds - AI analysis needs more time (Groq/Gemini can take 15-30s)
});

/**
 * Request Interceptor
 * Adds authorization token to all requests
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handles token refresh and error responses
 * Prevents multiple concurrent refresh attempts (request queue)
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const requestPath = originalRequest?.url || '';

    // Don't try to refresh token for auth endpoints
    // 401 on /auth/login means wrong credentials, not token expired
    const isAuthEndpoint = requestPath.includes('/auth/login') ||
      requestPath.includes('/auth/register') ||
      requestPath.includes('/auth/logout');

    // Handle 401 Unauthorized - attempt token refresh ONLY for non-auth endpoints
    if (
      error?.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      // Check if already refreshing
      if (requestQueue.getIsRefreshing()) {
        // Queue this request
        return new Promise((resolve, reject) => {
          requestQueue.addToQueue(
            (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            (err) => reject(err)
          );
        });
      }

      // Start refresh
      requestQueue.setRefreshing(true);

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true, timeout: 10000 }
        );

        // Validate refresh response
        if (!refreshResponse?.data?.accessToken) {
          throw new Error(ERROR_MESSAGES.AUTH.REFRESH_TOKEN_EXPIRED);
        }

        const { accessToken } = refreshResponse.data;
        localStorage.setItem('accessToken', accessToken);

        // Update original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process queued requests
        requestQueue.processQueue(accessToken);

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Token refresh failed - clear session and redirect
        clearAuthOnFailure();
        requestQueue.rejectQueue(refreshError);
        return Promise.reject(refreshError);
      }
    }

    // For auth endpoints with 401, don't try to refresh - let it bubble up
    // This preserves the actual error (invalid credentials, etc.)
    if (isAuthEndpoint && error?.response?.status === 401) {
      // Return the error as-is so authSlice can handle it properly
      return Promise.reject(error);
    }

    // Handle other error statuses
    if (error?.response?.status === 403) {
      // Forbidden - user doesn't have permission
      error.message = ERROR_MESSAGES.AUTH.UNAUTHORIZED;
    }

    if (error?.response?.status === 404) {
      // Not found
      error.message = 'Resource not found';
    }

    if (error?.response?.status >= 500) {
      // Server errors
      error.message = ERROR_MESSAGES.NETWORK.SERVER_ERROR;
    }

    // Network timeout
    if (error?.code === 'ECONNABORTED') {
      error.message = ERROR_MESSAGES.NETWORK.REQUEST_TIMEOUT;
    }

    // Network error
    if (!error?.response) {
      error.message = ERROR_MESSAGES.NETWORK.CONNECTION_FAILED;
    }

    return Promise.reject(error);
  }
);

/**
 * Clear authentication on token refresh failure
 */
function clearAuthOnFailure() {
  try {
    const itemsToClear = ['accessToken', 'loginError', 'registerError', 'user_session'];
    itemsToClear.forEach((item) => {
      localStorage.removeItem(item);
    });

    // Add logout marker to prevent redirect loops
    sessionStorage.setItem('auth_cleared', 'true');

    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Failed to clear auth:', error);
  }
}

export default api;
