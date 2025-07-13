// Airport selectors
export const getAirports = (state) => state.airports.airports;
export const getAirportSearchResults = (state) => state.airports.searchResults;
export const getAirportsLoading = (state) => state.airports.loading;
export const getAirportsError = (state) => state.airports.error;
export const getAirportsHasLoaded = (state) => state.airports.hasLoaded;
