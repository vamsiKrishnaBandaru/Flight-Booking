import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Flight, SearchParams } from './actions/flightActions';

// State Types
export interface FlightState {
  outboundFlights: Flight[];
  returnFlights: Flight[];
  selectedFlight: Flight | null;
  searchParams: SearchParams | null;
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}

export interface AirportState {
  airports: Airport[];
  searchResults: Airport[];
  loading: boolean;
  error: string | null;
  hasLoaded: boolean;
}

export interface Airport {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface RootState {
  flights: FlightState;
  airports: AirportState;
}

// Dispatch Types
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>; 