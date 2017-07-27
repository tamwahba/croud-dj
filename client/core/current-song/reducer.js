import { CURRENT_SONG_UPDATE } from './actions';
import { SongState } from '../song';

export function currentSongReducer(s = new SongState(), action) {
  let state = s;
  switch (action.type) {
    case CURRENT_SONG_UPDATE:
      state = new SongState(action.song);
      break;
    default:
      break;
  }
  return state;
}
