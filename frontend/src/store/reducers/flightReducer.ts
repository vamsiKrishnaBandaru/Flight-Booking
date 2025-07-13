import { produce } from 'immer';
import {
  SEARCH_FLIGHTS_REQUEST,
  SEARCH_FLIGHTS_SUCCESS,
  SEARCH_FLIGHTS_FAILURE,
  SET_SELECTED_FLIGHT,
  CLEAR_FLIGHT_SEARCH,
} from '../constants';
import { FlightState } from '../types';
import { FlightAction } from '../actions/flightActions';

const initialState: FlightState = {
  outboundFlights: [],
  returnFlights: [],
  selectedFlight: null,
  searchParams: null,
  loading: false,
  error: null,
  hasSearched: false,
};

const flightReducer = produce((draft: FlightState, action: FlightAction) => {
  switch (action.type) {
    case SEARCH_FLIGHTS_REQUEST:
      draft.loading = true;
      draft.error = null;
      break;

    case SEARCH_FLIGHTS_SUCCESS:
      draft.loading = false;
      draft.outboundFlights = action.data.filter(
        (f) => f.flightDirection === 'outbound',
      );
      draft.returnFlights = action.data.filter(
        (f) => f.flightDirection === 'return',
      );
      draft.searchParams = action.searchParams;
      draft.hasSearched = true;
      draft.error = null;
      break;

    case SEARCH_FLIGHTS_FAILURE:
      draft.loading = false;
      draft.error = action.error;
      draft.outboundFlights = [];
      draft.returnFlights = [];
      break;

    case SET_SELECTED_FLIGHT:
      draft.selectedFlight = action.flight;
      break;

    case CLEAR_FLIGHT_SEARCH:
      return initialState;

    default:
      break;
  }
}, initialState);

export default flightReducer; 