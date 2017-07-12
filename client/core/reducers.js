import { combineReducers } from 'redux';

import { currentSongReducer } from './current-song';
import { firebaseReducer } from './firebase';
import { roomReducer } from './room';
import { youtubeAPIReducer } from './youtube/api';
import { youtubePlayerReducer } from './youtube/player';

export default combineReducers({
  currentSong: currentSongReducer,
  firebase: firebaseReducer,
  room: roomReducer,
  youtube: combineReducers({
    api: youtubeAPIReducer,
    player: youtubePlayerReducer,
  }),
});
