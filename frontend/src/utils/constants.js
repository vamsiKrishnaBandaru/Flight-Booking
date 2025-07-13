// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// API Endpoints
export const API_ENDPOINTS = {
  FLIGHTS: {
    SEARCH: `${API_BASE_URL}/flights/search`,
    DETAILS: `${API_BASE_URL}/flights`,
  },
  BOOKINGS: {
    CREATE: `${API_BASE_URL}/bookings`,
    LIST: `${API_BASE_URL}/bookings`,
    DETAILS: `${API_BASE_URL}/bookings`,
    UPDATE: `${API_BASE_URL}/bookings`,
    CANCEL: `${API_BASE_URL}/bookings`,
  },
  AIRPORTS: `${API_BASE_URL}/airports`,
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
  },
};

// Flight Search Configuration
export const CABIN_CLASSES = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium-economy', label: 'Premium Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First Class' },
];

export const TRIP_TYPES = [
  { value: 'round-trip', label: 'Round Trip' },
  { value: 'one-way', label: 'One Way' },
];

// Airport Data (fallback)
export const FALLBACK_AIRPORTS = [
  { code: 'JFK', city: 'New York', country: 'USA' },
  { code: 'LAX', city: 'Los Angeles', country: 'USA' },
  { code: 'LHR', city: 'London', country: 'UK' },
  { code: 'CDG', city: 'Paris', country: 'France' },
  { code: 'NRT', city: 'Tokyo', country: 'Japan' },
  { code: 'DXB', city: 'Dubai', country: 'UAE' },
];
