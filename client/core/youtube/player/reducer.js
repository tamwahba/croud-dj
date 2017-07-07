import { Record } from 'immutable';

import { YOUTUBE_PLAYER_START,
  YOUTUBE_PLAYER_READY,
  YOUTUBE_PLAYER_ERROR } from './actions';

export const YoutubePlayerState = new Record({
  isLoaded: false,
  isLoading: false,
  hasError: false,
  player: null,
});

export function youtubePlayerReducer(s = new YoutubePlayerState(), action) {
  let state = s;
  switch (action.type) {
    case YOUTUBE_PLAYER_START:
      state = state.merge({
        isLoaded: false,
        isLoading: true,
        hasError: false,
      });
      break;
    case YOUTUBE_PLAYER_READY:
      state = state.merge({
        isLoaded: true,
        isLoading: false,
        hasError: false,
        player: action.player,
      });
      break;
    case YOUTUBE_PLAYER_ERROR:
      state = state.merge({
        isLoaded: false,
        isLoading: false,
        hasError: true,
      });
      break;
    default:
      break;
  }

  return state;
}
