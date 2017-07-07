import { Record } from 'immutable';

import { CURRENT_SONG_BUFFERING,
  CURRENT_SONG_ELAPSED,
  CURRENT_SONG_ERROR,
  CURRENT_SONG_PAUSED,
  CURRENT_SONG_PLAYING,
  CURRENT_SONG_UPDATE } from './actions';
import { CurrentSongStatuses, CurrentSongTypes } from './enums';

export const CurrentSong = new Record({
  album: '',
  artist: '',
  duration: 0,
  elapsed: 0,
  id: '',
  status: CurrentSongStatuses.BUFFERING,
  title: '',
  type: CurrentSongTypes.YOUTUBE,
});

export function currentSongReducer(s = new CurrentSong(), action) {
  let state = s;
  switch (action.type) {
    case CURRENT_SONG_BUFFERING:
      state = state.set('status', CurrentSongStatuses.BUFFERING);
      break;
    case CURRENT_SONG_ELAPSED:
      state = state.set('elapsed', action.elapsed);
      break;
    case CURRENT_SONG_ERROR:
      state = state.set('status', CurrentSongStatuses.ERROR);
      break;
    case CURRENT_SONG_PAUSED:
      state = state.set('status', CurrentSongStatuses.PAUSED);
      break;
    case CURRENT_SONG_PLAYING:
      state = state.set('status', CurrentSongStatuses.PLAYING);
      break;
    case CURRENT_SONG_UPDATE:
      state = new CurrentSong(Object.assign(state.toJS(), action.song));
      break;
    default:
      break;
  }
  return state;
}
