import { combineReducers } from 'redux';

import { youtubeAPIReducer } from './youtube/api';
import { youtubePlayerReducer } from './youtube/player';

export default combineReducers({
  youtubeAPI: youtubeAPIReducer,
  youtubePlayer: youtubePlayerReducer,
});
