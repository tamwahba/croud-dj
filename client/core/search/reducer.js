import { List, Record } from 'immutable';

import { SongState } from '../song';

import { SEARCH_CLEAR, SEARCH_START, SEARCH_SUCCESS, SEARCH_FAILURE } from './actions';

export const SearchState = new Record({
  isLoading: false,
  results: new List(),
  query: '',
});

export function searchReducer(s = new SearchState(), action) {
  let state = s;
  switch (action.type) {
    case SEARCH_CLEAR:
      state = new SearchState();
      break;
    case SEARCH_START:
      state = new SearchState({
        isLoading: true,
        query: action.query,
      });
      break;
    case SEARCH_SUCCESS:
      state = state.merge({
        isLoading: false,
        results: new List(action.results.map(song => new SongState(song))),
      });
      break;
    case SEARCH_FAILURE:
      state = state.merge({
        isLoading: false,
        results: new List(),
      });
      break;
    default:
      break;
  }

  return state;
}
