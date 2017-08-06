import { combineReducers } from 'redux';

import { currentSongReducer } from './current-song';
import { currentUserReducer } from './current-user';
import { firebaseReducer } from './firebase';
import { roomReducer } from './room';
import { searchReducer } from './search';
import { songListsReducer } from './song-lists';
import { usersReducer } from './users';
import { youtubeAPIReducer } from './youtube/api';
import { youtubePlayerReducer } from './youtube/player';

export default combineReducers({
  currentSong: currentSongReducer,
  currentUser: currentUserReducer,
  firebase: firebaseReducer,
  songLists: songListsReducer,
  room: roomReducer,
  search: searchReducer,
  users: usersReducer,
  youtube: combineReducers({
    api: youtubeAPIReducer,
    player: youtubePlayerReducer,
  }),
});
