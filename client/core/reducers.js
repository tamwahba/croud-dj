import { combineReducers } from 'redux';

import { currentSongReducer } from './current-song';
import { youtubeAPIReducer } from './youtube/api';
import { youtubePlayerReducer } from './youtube/player';

export default combineReducers({
  youtube: combineReducers({
    api: youtubeAPIReducer,
    player: youtubePlayerReducer,
  }),
  currentSong: currentSongReducer,
});
