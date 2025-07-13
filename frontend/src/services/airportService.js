import { getAirportsAPI, searchAirportsAPI } from '../utils/apiUtils';

export const airportService = {
  // Get all available airports
  getAirports() {
    return getAirportsAPI().then((result) => result.data || []);
  },

  // Search airports by query
  searchAirports(query) {
    return searchAirportsAPI(query).then((result) => result.data || []);
  },
};
