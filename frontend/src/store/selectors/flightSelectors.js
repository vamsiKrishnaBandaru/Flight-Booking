import { createSelector } from 'reselect';

// Base selectors
const getFlightsState = (state) => state.flights;

// Memoized selectors
export const getOutboundFlights = createSelector(
  [getFlightsState],
  (flights) => flights.outboundFlights,
);

export const getReturnFlights = createSelector(
  [getFlightsState],
  (flights) => flights.returnFlights,
);

export const getSelectedFlight = createSelector(
  [getFlightsState],
  (flights) => flights.selectedFlight,
);

export const getFlightSearchParams = createSelector(
  [getFlightsState],
  (flights) => flights.searchParams,
);

export const getFlightsLoading = createSelector(
  [getFlightsState],
  (flights) => flights.loading,
);

export const getFlightsError = createSelector(
  [getFlightsState],
  (flights) => flights.error,
);

export const getFlightsHasSearched = createSelector(
  [getFlightsState],
  (flights) => flights.hasSearched,
);

// Computed selectors
export const getFlightById = createSelector(
  [getOutboundFlights, getReturnFlights, (_, flightId) => flightId],
  (outbound, returnFlights, flightId) => {
    const allFlights = [...outbound, ...returnFlights];
    return allFlights.find((flight) => flight.id === flightId);
  },
);

export const getFlightsByDirection = createSelector(
  [getOutboundFlights, getReturnFlights, (_, direction) => direction],
  (outbound, returnFlights, direction) => {
    return direction === 'outbound' ? outbound : returnFlights;
  },
);

export const getFlightCount = createSelector(
  [getOutboundFlights, getReturnFlights],
  (outbound, returnFlights) => outbound.length + returnFlights.length,
);

export const getHasFlights = createSelector(
  [getFlightCount],
  (count) => count > 0,
);

export const getFlightLoadingState = createSelector(
  [getFlightsLoading, getFlightsError, getFlightsHasSearched],
  (loading, error, hasSearched) => ({
    loading,
    error,
    hasSearched,
  }),
);
