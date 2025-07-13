const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  // Ensure there are no double slashes
  const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message:
        'Network response was not ok and error response is not valid JSON.',
    }));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
};

// Booking API functions
export const bookingApi = {
  // Create a new booking
  create: async (bookingData) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: bookingData,
    });
  },

  // Get booking by ID
  getById: async (bookingId) => {
    return apiRequest(`/bookings/${bookingId}`);
  },

  // Get bookings by user ID
  getByUserId: async (userId) => {
    return apiRequest(`/bookings/user/${userId}`);
  },

  // Cancel booking
  cancel: async (bookingId, userId) => {
    return apiRequest(`/bookings/${bookingId}`, {
      method: 'DELETE',
      body: { userId },
    });
  },

  // Update booking
  update: async (bookingId, bookingData, userId) => {
    return apiRequest(`/bookings/${bookingId}`, {
      method: 'PUT',
      body: { ...bookingData, userId },
    });
  },
};

// Flight API functions (in case they're needed)
export const flightApi = {
  // Search flights
  search: async (searchParams) => {
    const queryString = new URLSearchParams(searchParams).toString();
    return apiRequest(`/flights/search?${queryString}`);
  },

  // Get flight by ID
  getById: async (flightId) => {
    return apiRequest(`/flights/${flightId}`);
  },
};

// Airport API functions
export const airportApi = {
  // Get all airports
  getAll: async () => {
    return apiRequest('/airports');
  },
};
