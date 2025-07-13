import { API_ENDPOINTS } from '../utils/constants';
import { supabase } from '../lib/supabase';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const getAuthToken = async () => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    throw new Error('User not authenticated');
  }
  
  return session.access_token;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  return data;
};

const retryRequest = async (requestFn) => {
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
      }
    }
  }
  throw lastError;
};

export const bookingApi = {
  create: async (bookingData) => {
    return retryRequest(async () => {
      const accessToken = await getAuthToken();
      
      // Transform the data to match backend expectations
      const transformedData = {
        flightId: bookingData.flightId,
        totalAmount: bookingData.totalAmount,
        bookingStatus: bookingData.status || 'confirmed',
        passengers: bookingData.passengers.map(p => ({
          firstName: p.firstName,
          lastName: p.lastName,
          dateOfBirth: p.dateOfBirth
        }))
      };
      
      const response = await fetch(API_ENDPOINTS.BOOKINGS.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(transformedData),
      });
      
      return handleResponse(response);
    });
  },

  get: async (bookingId) => {
    return retryRequest(async () => {
      const accessToken = await getAuthToken();
      
      const response = await fetch(`${API_ENDPOINTS.BOOKINGS.DETAILS}/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      return handleResponse(response);
    });
  },

  list: async () => {
    return retryRequest(async () => {
      const accessToken = await getAuthToken();
      
      const response = await fetch(API_ENDPOINTS.BOOKINGS.LIST, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      return handleResponse(response);
    });
  },

  update: async (bookingId, updates) => {
    return retryRequest(async () => {
      const accessToken = await getAuthToken();
      
      const response = await fetch(`${API_ENDPOINTS.BOOKINGS.UPDATE}/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updates),
      });
      
      return handleResponse(response);
    });
  },
};
