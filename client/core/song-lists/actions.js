import { app } from '../firebase';

export const SONG_LISTS_LIST_LOADED = 'SONG_LISTS_LIST_LOADED';
export const SONG_LISTS_SONG_ADDED = 'SONG_LISTS_SONG_ADDED';
export const SONG_LISTS_SONG_CHANGED = 'SONG_LISTS_SONG_CHANGED';
export const SONG_LISTS_SONG_MOVED = 'SONG_LISTS_SONG_MOVED';
export const SONG_LISTS_SONG_REMOVED = 'SONG_LISTS_REMOVED';

export function songListsLoad(listKey, order, list) {
  return {
    type: SONG_LISTS_LIST_LOADED,
    list,
    listKey,
    order,
  };
}

export function songListsSongAdd(listKey, song, songKey, previousSongKey) {
  return {
    type: SONG_LISTS_SONG_ADDED,
    listKey,
    previousSongKey,
    song,
    songKey,
  };
}

export function songListsSongChange(listKey, song, songKey, previousSongKey) {
  return {
    type: SONG_LISTS_SONG_CHANGED,
    listKey,
    previousSongKey,
    song,
    songKey,
  };
}

export function songListsSongMove(listKey, song, songKey, previousSongKey) {
  return {
    type: SONG_LISTS_SONG_MOVED,
    listKey,
    previousSongKey,
    song,
    songKey,
  };
}

export function songListsSongRemove(listKey, songKey) {
  return {
    type: SONG_LISTS_SONG_REMOVED,
    listKey,
    songKey,
  };
}

export function watchSongList(firebaseRef, listKey) {
  return (dispatch, getState) => (
    firebaseRef.once('value', (ds) => {
      const order = [];
      ds.forEach((child) => { order.push(child.key); });
      dispatch(songListsLoad(listKey, order, ds.val()));
    }).then(() => {
      firebaseRef.on('child_added', (ds, previousKey) => {
        const list = getState().songLists.get(listKey);
        if (list && !list.order.contains(ds.key)) {
          dispatch(songListsSongAdd(listKey, ds.val(), ds.key, previousKey));
        }
      });

      firebaseRef.on('child_changed', (ds, previousKey) => {
        dispatch(songListsSongChange(listKey, ds.val(), ds.key, previousKey));
      });

      firebaseRef.on('child_moved', (ds, previousKey) => {
        dispatch(songListsSongMove(listKey, ds.val(), ds.key, previousKey));
      });

      firebaseRef.on('child_removed', (ds) => {
        dispatch(songListsSongRemove(listKey, ds.key));
      });
    }));
}

export function addSong(roomName, listKey, s) {
  return () => {
    const song = Object.assign({}, s, { votes: 0 });
    app.database().ref(`rooms/${roomName}/${listKey}`).push(song);
  };
}

export function downVoteSong(roomName, listKey, songKey) {
  return () => {
    app.database().ref(`rooms/${roomName}/${listKey}/${songKey}/votes`).transaction(val => val + 1);
  };
}

export function upVoteSong(roomName, listKey, songKey) {
  return () => {
    app.database().ref(`rooms/${roomName}/${listKey}/${songKey}/votes`).transaction(val => val - 1);
  };
}
