import { Record } from 'immutable';

import {
  YOUTUBE_API_FETCH_START,
  YOUTUBE_API_FETCH_SUCCESS,
  YOUTUBE_API_FETCH_FAILURE } from './actions';

export const YoutubeAPIState = new Record({
  api: null,
  isFailed: false,
  isLoaded: false,
  isLoading: false,
});

export function youtubeAPIReducer(s = new YoutubeAPIState(), action) {
  let state = s;
  switch (action.type) {
    case YOUTUBE_API_FETCH_START :
      state = state.merge({
        api: null,
        isFailed: false,
        isLoaded: false,
        isLoading: true,
      });
      break;
    case YOUTUBE_API_FETCH_SUCCESS :
      state = state.merge({
        api: action.api,
        isFailed: false,
        isLoaded: true,
        isLoading: false,
      });
      break;
    case YOUTUBE_API_FETCH_FAILURE :
      state = state.merge({
        api: null,
        isFailed: true,
        isLoaded: false,
        isLoading: false,
      });
      break;
    default:
      break;
  }
  return state;
}
