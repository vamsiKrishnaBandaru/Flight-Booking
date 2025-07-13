// Common HTTP status codes and their user-friendly messages
const HTTP_ERROR_MESSAGES = {
  400: 'The request was invalid. Please check your input and try again.',
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'A conflict occurred. Please try again.',
  422: 'The provided data was invalid.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'An internal server error occurred. Please try again later.',
  502: 'The server is temporarily unavailable. Please try again later.',
  503: 'The service is unavailable. Please try again later.',
  504: 'The server took too long to respond. Please try again.',
};

// Network error messages
const NETWORK_ERROR_MESSAGES = {
  offline: 'No internet connection. Please check your network and try again.',
  timeout: 'The request timed out. Please try again.',
};

/**
 * Get a user-friendly error message from an API error
 */
export const getErrorMessage = (error) => {
  // Network errors
  if (!navigator.onLine) {
    return NETWORK_ERROR_MESSAGES.offline;
  }

  if (error.name === 'TimeoutError') {
    return NETWORK_ERROR_MESSAGES.timeout;
  }

  // HTTP errors
  if (error.response) {
    const status = error.response.status;
    const serverMessage = error.response.data?.message;

    // Use server message if available, fallback to standard HTTP message
    return serverMessage || HTTP_ERROR_MESSAGES[status] || 'An unexpected error occurred.';
  }

  // Authentication errors
  if (error.message?.includes('not authenticated')) {
    return 'Please sign in to continue.';
  }

  if (error.message?.includes('invalid credentials')) {
    return 'Invalid email or password.';
  }

  // Validation errors
  if (error.message?.includes('validation')) {
    return 'Please check your input and try again.';
  }

  // Default error message
  return error.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Check if an error is a network error
 */
export const isNetworkError = (error) => {
  return !navigator.onLine || error.name === 'TimeoutError';
};

/**
 * Check if an error is an authentication error
 */
export const isAuthError = (error) => {
  return (
    error.response?.status === 401 ||
    error.message?.includes('not authenticated') ||
    error.message?.includes('invalid credentials')
  );
};

/**
 * Check if an error is a validation error
 */
export const isValidationError = (error) => {
  return (
    error.response?.status === 422 ||
    error.response?.status === 400 ||
    error.message?.includes('validation')
  );
};

/**
 * Format validation errors into a user-friendly object
 */
export const formatValidationErrors = (error) => {
  if (!error.response?.data?.errors) {
    return {};
  }

  const errors = {};
  Object.entries(error.response.data.errors).forEach(([field, messages]) => {
    errors[field] = Array.isArray(messages) ? messages[0] : messages;
  });

  return errors;
}; 