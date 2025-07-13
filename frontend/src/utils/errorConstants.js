// Centralized error messages
export const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR:
    'Network error. Please check your internet connection and try again.',
  SERVER_ERROR: 'Server error. Please try again in a few moments.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',

  // Authentication errors
  UNAUTHORIZED: 'Please sign in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',

  // Validation errors
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_DATE: 'Please enter a valid date.',
  INVALID_AIRPORT: 'Please select a valid airport.',

  // Flight search errors
  NO_FLIGHTS_FOUND:
    'No flights found for your search criteria. Try adjusting your dates or destinations.',
  SEARCH_FAILED: 'Flight search failed. Please try again.',
  INVALID_SEARCH_PARAMS: 'Please fill in all required search fields.',

  // Booking errors
  BOOKING_FAILED: 'Booking failed. Please try again.',
  PAYMENT_FAILED:
    'Payment processing failed. Please check your payment details.',
  SEAT_UNAVAILABLE:
    'Selected seats are no longer available. Please choose different seats.',

  // General errors
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  MAINTENANCE_MODE:
    'The system is currently under maintenance. Please try again later.',
};

// Error types for consistent handling
export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION',
  BUSINESS: 'BUSINESS',
  SYSTEM: 'SYSTEM',
};

// Error handler utility
export const handleApiError = (error, customMessage = null) => {
  console.error('API Error:', error);

  // Use custom message if provided
  if (customMessage) {
    return customMessage;
  }

  // Handle different error types
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  if (error.message) {
    // Check for specific error messages from backend
    const message = error.message.toLowerCase();

    if (message.includes('unauthorized') || message.includes('401')) {
      return ERROR_MESSAGES.UNAUTHORIZED;
    }

    if (message.includes('forbidden') || message.includes('403')) {
      return ERROR_MESSAGES.FORBIDDEN;
    }

    if (message.includes('not found') || message.includes('404')) {
      return ERROR_MESSAGES.NO_FLIGHTS_FOUND;
    }

    if (message.includes('timeout')) {
      return ERROR_MESSAGES.TIMEOUT_ERROR;
    }

    if (message.includes('server') || message.includes('500')) {
      return ERROR_MESSAGES.SERVER_ERROR;
    }

    // Return the original error message if it's user-friendly
    if (error.message.length < 100 && !error.message.includes('fetch')) {
      return error.message;
    }
  }

  return ERROR_MESSAGES.GENERIC_ERROR;
};

// Toast notification helper
export const showErrorToast = (error, customMessage = null) => {
  const message = handleApiError(error, customMessage);

  // You can integrate with your toast library here
  // For now, we'll use alert as fallback
  if (typeof window !== 'undefined') {
    console.error('Error:', message);
    // This will be replaced with proper toast notification
    return message;
  }

  return message;
};
