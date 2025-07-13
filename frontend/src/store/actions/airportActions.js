import {
  GET_AIRPORTS_REQUEST,
  GET_AIRPORTS_SUCCESS,
  GET_AIRPORTS_FAILURE,
  SEARCH_AIRPORTS_REQUEST,
  SEARCH_AIRPORTS_SUCCESS,
  SEARCH_AIRPORTS_FAILURE,
} from '../constants';
import { getAirportsAPI, searchAirportsAPI } from '../../utils/apiUtils';
import { makeAPIRequest } from './apiActions';

// Get all airports action - exactly like your example
export const getAirportsData = () => (dispatch, getState) => {
  const { loading, hasLoaded } = getState().airports;

  // Prevent duplicate API calls
  if (loading || hasLoaded) {
    return Promise.resolve();
  }

  dispatch({ type: GET_AIRPORTS_REQUEST });

  return dispatch(makeAPIRequest(getAirportsAPI))
    .then((response) => {
      dispatch({
        type: GET_AIRPORTS_SUCCESS,
        data: response.data,
      });
      return response;
    })
    .catch((error) => {
      dispatch({
        type: GET_AIRPORTS_FAILURE,
        error: error.message,
      });
      throw error;
    });
};

// Search airports action - exactly like your example
export const searchAirportsData = (query) => (dispatch) => {
  dispatch({ type: SEARCH_AIRPORTS_REQUEST });

  return dispatch(makeAPIRequest(searchAirportsAPI, query))
    .then((response) => {
      dispatch({
        type: SEARCH_AIRPORTS_SUCCESS,
        data: response.data,
        query,
      });
      return response;
    })
    .catch((error) => {
      dispatch({
        type: SEARCH_AIRPORTS_FAILURE,
        error: error.message,
      });
      throw error;
    });
};
