import { produce } from 'immer';
import {
  GET_AIRPORTS_REQUEST,
  GET_AIRPORTS_SUCCESS,
  GET_AIRPORTS_FAILURE,
  SEARCH_AIRPORTS_REQUEST,
  SEARCH_AIRPORTS_SUCCESS,
  SEARCH_AIRPORTS_FAILURE,
} from '../constants';

const initialState = {
  airports: [],
  searchResults: [],
  loading: false,
  error: null,
  hasLoaded: false,
};

// Airport reducer with immer - exactly like your example
const airportReducer = produce((draft, action) => {
  switch (action.type) {
    case GET_AIRPORTS_REQUEST:
      draft.loading = true;
      draft.error = null;
      break;

    case GET_AIRPORTS_SUCCESS:
      draft.loading = false;
      draft.airports = action.data;
      draft.hasLoaded = true;
      draft.error = null;
      break;

    case GET_AIRPORTS_FAILURE:
      draft.loading = false;
      draft.error = action.error;
      break;

    case SEARCH_AIRPORTS_REQUEST:
      draft.loading = true;
      draft.error = null;
      break;

    case SEARCH_AIRPORTS_SUCCESS:
      draft.loading = false;
      draft.searchResults = action.data;
      draft.error = null;
      break;

    case SEARCH_AIRPORTS_FAILURE:
      draft.loading = false;
      draft.error = action.error;
      break;

    default:
      break;
  }
}, initialState);

export default airportReducer;
