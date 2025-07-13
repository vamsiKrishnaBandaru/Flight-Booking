import { API_BASE_URL } from './constants';

// Error messages constants
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};

// Base API request function
const makeAPIRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || getErrorMessage(response.status));
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Get appropriate error message based on status code
const getErrorMessage = (status) => {
  switch (status) {
    case 400:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 500:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return ERROR_MESSAGES.GENERIC_ERROR;
  }
};

// GET request utility
export const newGetFromAPI = async (endpoint, path = '', params = {}) => {
  const url = new URL(
    `${API_BASE_URL}/${endpoint.toLowerCase()}${path ? `/${path}` : ''}`,
  );

  // Add query parameters
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });

  return makeAPIRequest(url.toString(), {
    method: 'GET',
  });
};

// POST request utility
export const newPostToAPI = async (endpoint, path = '', data = {}) => {
  const url = `${API_BASE_URL}/${endpoint.toLowerCase()}${path ? `/${path}` : ''}`;

  return makeAPIRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// PUT request utility
export const newPutToAPI = async (endpoint, path = '', data = {}) => {
  const url = `${API_BASE_URL}/${endpoint.toLowerCase()}${path ? `/${path}` : ''}`;

  return makeAPIRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// DELETE request utility
export const newDeleteFromAPI = async (endpoint, path = '') => {
  const url = `${API_BASE_URL}/${endpoint.toLowerCase()}${path ? `/${path}` : ''}`;

  return makeAPIRequest(url, {
    method: 'DELETE',
  });
};

// Specific API functions
export const getAirportsAPI = () => newGetFromAPI('airports');
export const searchAirportsAPI = (query) =>
  newGetFromAPI('airports', 'search', { q: query });
export const searchFlightsAPI = (data) =>
  newPostToAPI('flights', 'search', data);
export const createBookingAPI = (data) => newPostToAPI('bookings', '', data);
export const getBookingDetailsAPI = (id) => newGetFromAPI('bookings', id);
export const getFlightDetailsAPI = (id) => newGetFromAPI('flights', id);
