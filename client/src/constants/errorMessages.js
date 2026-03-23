/**
 * Centralized Error Messages
 * Production-ready error handling with consistent messaging across the application
 * 
 * Message Categories:
 * - AUTH: Authentication and authorization errors
 * - VALIDATION: Form validation and input errors
 * - NETWORK: Network and API communication errors
 * - STORAGE: localStorage and data persistence errors
 * - UNKNOWN: Unhandled or unexpected errors
 */

export const ERROR_MESSAGES = {
  // Authentication Errors
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
    USER_NOT_FOUND: 'User account not found. Please check your email address.',
    USER_ALREADY_EXISTS: 'An account with this email already exists. Please login instead.',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long.',
    PASSWORD_WEAK: 'Password must contain letters and numbers.',
    PASSWORDS_DONT_MATCH: 'Passwords do not match. Please try again.',
    EMAIL_INVALID: 'Please enter a valid email address.',
    EMAIL_REQUIRED: 'Email is required.',
    PASSWORD_REQUIRED: 'Password is required.',
    NAME_REQUIRED: 'Full name is required.',
    LOGIN_FAILED: 'Login failed. Please try again.',
    REGISTRATION_FAILED: 'Registration failed. Please try again.',
    LOGOUT_FAILED: 'Logout failed. Please try again.',
    SESSION_EXPIRED: 'Your session has expired. Please login again.',
    UNAUTHORIZED: 'You are not authorized to access this resource.',
    REFRESH_TOKEN_EXPIRED: 'Your session has expired. Please login again.',
    NO_TOKEN: 'Authentication token not found. Please login.',
  },

  // Network Errors
  NETWORK: {
    CONNECTION_FAILED: 'Connection failed. Please check your internet connection.',
    REQUEST_TIMEOUT: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    SERVICE_UNAVAILABLE: 'Service unavailable. Please try again later.',
    INVALID_RESPONSE: 'Invalid response from server. Please try again.',
    CORS_ERROR: 'Request blocked by security policy. Please contact support.',
  },

  // Validation Errors
  VALIDATION: {
    INVALID_EMAIL: 'Invalid email format.',
    INVALID_INPUT: 'Please enter valid information.',
    FIELD_REQUIRED: 'This field is required.',
    MIN_LENGTH: 'Input too short.',
    MAX_LENGTH: 'Input too long.',
  },

  // Storage Errors
  STORAGE: {
    CLEAR_FAILED: 'Failed to clear session data.',
    SAVE_FAILED: 'Failed to save data. Please try again.',
    LOAD_FAILED: 'Failed to load data. Please refresh the page.',
  },

  // Generic Errors
  UNKNOWN: {
    UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.',
    SOMETHING_WENT_WRONG: 'Something went wrong. Please try again later.',
    CONTACT_SUPPORT: 'Please contact support if the problem persists.',
  },
};

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN: 'Logged in successfully!',
  REGISTER: 'Registration successful! Please login.',
  LOGOUT: 'Logged out successfully.',
  UPDATE: 'Changes saved successfully.',
  DELETE: 'Deleted successfully.',
  UPLOAD: 'File uploaded successfully.',
};

/**
 * Extract user-friendly error message from various error sources
 * @param {Error|Object} error - Error object from API, Redux, or JS
 * @param {string} defaultMessage - Default message if extraction fails
 * @returns {string} User-friendly error message
 */
export const extractErrorMessage = (error, defaultMessage = ERROR_MESSAGES.UNKNOWN.UNEXPECTED_ERROR) => {
  // Try common error structures in order of likelihood
  if (typeof error === 'string') {
    return error;
  }

  // Redux thunk rejection payload
  if (error?.payload && typeof error.payload === 'string') {
    return error.payload;
  }

  // Axios error response
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  // Status text from response
  if (error?.response?.statusText) {
    return error.response.statusText;
  }

  // Generic error message
  if (error?.message) {
    return error.message;
  }

  // Fallback to default
  return defaultMessage;
};

/**
 * Get error message by status code
 * @param {number} statusCode - HTTP status code
 * @returns {string} User-friendly error message
 */
export const getErrorByStatus = (statusCode) => {
  const statusMap = {
    400: ERROR_MESSAGES.VALIDATION.INVALID_INPUT,
    401: ERROR_MESSAGES.AUTH.UNAUTHORIZED,
    403: ERROR_MESSAGES.AUTH.UNAUTHORIZED,
    404: 'Resource not found.',
    408: ERROR_MESSAGES.NETWORK.REQUEST_TIMEOUT,
    409: 'Conflict: This resource already exists.',
    500: ERROR_MESSAGES.NETWORK.SERVER_ERROR,
    503: ERROR_MESSAGES.NETWORK.SERVICE_UNAVAILABLE,
  };

  return statusMap[statusCode] || ERROR_MESSAGES.UNKNOWN.UNEXPECTED_ERROR;
};

/**
 * Determine error type for specific handling
 * @param {Error|Object} error - Error object
 * @returns {string} Error type: 'auth', 'network', 'validation', 'storage', 'unknown'
 */
export const getErrorType = (error) => {
  if (!error) return 'unknown';

  const message = extractErrorMessage(error).toLowerCase();
  const status = error?.response?.status;

  // Auth errors
  if (status === 401 || status === 403 || message.includes('unauthorized') || message.includes('invalid credentials')) {
    return 'auth';
  }

  // Network errors
  if (status >= 500 || message.includes('network') || message.includes('connection') || message.includes('timeout')) {
    return 'network';
  }

  // Validation errors
  if (status === 400 || message.includes('invalid') || message.includes('required')) {
    return 'validation';
  }

  // Storage errors
  if (message.includes('storage') || message.includes('localstorage')) {
    return 'storage';
  }

  return 'unknown';
};
