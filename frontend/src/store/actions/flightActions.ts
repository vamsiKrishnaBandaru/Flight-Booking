import {
  SEARCH_FLIGHTS_REQUEST,
  SEARCH_FLIGHTS_SUCCESS,
  SEARCH_FLIGHTS_FAILURE,
  SET_SELECTED_FLIGHT,
  CLEAR_FLIGHT_SEARCH,
} from '../constants';
import { searchFlightsAPI } from '../../utils/apiUtils';
import { makeAPIRequest } from './apiActions';
import { getErrorMessage } from '../../utils/errorHandling';
import { AppDispatch } from '../types';

// Types
export type Airport = {
  id: number;
  code: string;
  name: string;
  city: string;
  country: string;
};

export type Flight = {
  id: string;
  airline: string;
  flightNumber: string;
  origin: Airport;
  destination: Airport;
  departureTime: string;
  arrivalTime: string;
  price: number;
  flightDirection: 'outbound' | 'return';
};

export type SearchParams = {
  originId: string;
  destinationId: string;
  departureDate: string;
  returnDate?: string;
  passengers: {
    adults: number;
    children: number;
  };
};

// Action Types
export type SearchFlightsRequestAction = {
  type: typeof SEARCH_FLIGHTS_REQUEST;
};

export type SearchFlightsSuccessAction = {
  type: typeof SEARCH_FLIGHTS_SUCCESS;
  data: Flight[];
  searchParams: SearchParams;
};

export type SearchFlightsFailureAction = {
  type: typeof SEARCH_FLIGHTS_FAILURE;
  error: string;
};

export type SetSelectedFlightAction = {
  type: typeof SET_SELECTED_FLIGHT;
  flight: Flight | null;
};

export type ClearFlightSearchAction = {
  type: typeof CLEAR_FLIGHT_SEARCH;
};

export type FlightAction =
  | SearchFlightsRequestAction
  | SearchFlightsSuccessAction
  | SearchFlightsFailureAction
  | SetSelectedFlightAction
  | ClearFlightSearchAction;

// Action Creators
export const searchFlightsRequest = (): SearchFlightsRequestAction => ({
  type: SEARCH_FLIGHTS_REQUEST,
});

export const searchFlightsSuccess = (
  data: Flight[],
  searchParams: SearchParams,
): SearchFlightsSuccessAction => ({
  type: SEARCH_FLIGHTS_SUCCESS,
  data,
  searchParams,
});

export const searchFlightsFailure = (error: string): SearchFlightsFailureAction => ({
  type: SEARCH_FLIGHTS_FAILURE,
  error,
});

export const setSelectedFlight = (flight: Flight | null): SetSelectedFlightAction => ({
  type: SET_SELECTED_FLIGHT,
  flight,
});

export const clearFlightSearch = (): ClearFlightSearchAction => ({
  type: CLEAR_FLIGHT_SEARCH,
});

// Thunk Actions
export const searchFlightsData = (searchParams: SearchParams) => async (dispatch: AppDispatch) => {
  try {
    dispatch(searchFlightsRequest());

    const response = await makeAPIRequest(searchFlightsAPI, searchParams)();
    
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid response format');
    }

    dispatch(searchFlightsSuccess(response.data, searchParams));
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(searchFlightsFailure(errorMessage));
    throw error;
  }
}; 