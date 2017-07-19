import { List, Map, Record } from 'immutable';

import { SONG_LISTS_LIST_LOADED,
  SONG_LISTS_SONG_ADDED,
  SONG_LISTS_SONG_CHANGED,
  SONG_LISTS_SONG_MOVED,
  SONG_LISTS_SONG_REMOVED } from './actions';

export const SongState = new Record({
  addedBy: '',
  artist: '',
  artwork: '',
  duration: 0,
  id: '',
  title: '',
  service: '',
  votes: 0,
});

export const SongListState = new Record({
  order: List(),
  songs: Map(),
});

export function songListsReducer(s = new Map(), action) {
  let state = s;

  switch (action.type) {
    case SONG_LISTS_LIST_LOADED:
      state = state.set(action.listKey, new SongListState({
        order: new List(action.order),
        songs: new Map(action.list),
      }));
      break;
    case SONG_LISTS_SONG_ADDED:
      state = state.updateIn([action.listKey, 'order'], new List(), (order) => {
        const idx = order.indexOf(action.previousSongKey);
        return order.insert(idx + 1, action.songKey);
      });
      state = state.updateIn([action.listKey, 'songs'], new Map(), songs => songs.set(action.songKey, new SongState(action.song)));
      break;
    case SONG_LISTS_SONG_CHANGED:
      state = state.updateIn([action.listKey, 'songs'], songs => songs.set(action.songKey, new SongState(action.song)));
      break;
    case SONG_LISTS_SONG_MOVED:
      state = state.updateIn([action.listKey, 'order'], (o) => {
        const idx = o.indexOf(action.previousSongKey);

        let order = o.filterNot(val => val === action.songKey);
        order = order.insert(idx + 1, action.songKey);
        return order;
      });
      break;
    case SONG_LISTS_SONG_REMOVED:
      state = state.updateIn([action.listKey, 'order'], order => order.filterNot(val => val === action.songKey));
      state = state.updateIn([action.listKey, 'songs'], songs => songs.delete(action.songKey));
      break;
    default:
      break;
  }

  return state;
}
