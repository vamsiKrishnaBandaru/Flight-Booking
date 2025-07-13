// Forcing a new build to bypass Vercel's cache.
// Last attempt to fix the URL construction. Using the robust URL constructor.
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const baseUrl = API_BASE_URL || 'http://localhost:3000';
  const url = new URL(endpoint, baseUrl); // Use the robust URL constructor

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
    return apiRequest('/api/bookings', {
      method: 'POST',
      body: bookingData,
    });
  },

  // Get booking by ID
  getById: async (bookingId) => {
    return apiRequest(`/api/bookings/${bookingId}`);
  },

  // Get bookings by user ID
  getByUserId: async (userId) => {
    return apiRequest(`/api/bookings/user/${userId}`);
  },

  // Cancel booking
  cancel: async (bookingId, userId) => {
    return apiRequest(`/api/bookings/${bookingId}`, {
      method: 'DELETE',
      body: { userId },
    });
  },

  // Update booking
  update: async (bookingId, bookingData, userId) => {
    return apiRequest(`/api/bookings/${bookingId}`, {
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
    return apiRequest(`/api/flights/search?${queryString}`);
  },

  // Get flight by ID
  getById: async (flightId) => {
    return apiRequest(`/api/flights/${flightId}`);
  },
};

// Airport API functions
export const airportApi = {
  // Get all airports
  getAll: async () => {
    return apiRequest('/api/airports');
  },
};
