import { combineReducers } from 'redux';
import flightReducer from './flightReducer';
import airportReducer from './airportReducer';

const rootReducer = combineReducers({
  flights: flightReducer,
  airports: airportReducer,
});

export default rootReducer;
