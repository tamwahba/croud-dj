import { combineReducers } from 'redux';

import { currentSongReducer } from './current-song';
import { firebaseReducer } from './firebase';
import { roomReducer } from './room';
import { searchReducer } from './search';
import { songListsReducer } from './song-lists';
import { youtubeAPIReducer } from './youtube/api';
import { youtubePlayerReducer } from './youtube/player';

export default combineReducers({
  currentSong: currentSongReducer,
  firebase: firebaseReducer,
  songLists: songListsReducer,
  room: roomReducer,
  search: searchReducer,
  youtube: combineReducers({
    api: youtubeAPIReducer,
    player: youtubePlayerReducer,
  }),
});
