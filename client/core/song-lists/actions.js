import { Map } from 'immutable';

import { app } from '../firebase';
import { SongState, VoteDirections } from '../song';

export const SONG_LISTS_LIST_LOADED = 'SONG_LISTS_LIST_LOADED';
export const SONG_LISTS_SONG_ADDED = 'SONG_LISTS_SONG_ADDED';
export const SONG_LISTS_SONG_CHANGED = 'SONG_LISTS_SONG_CHANGED';
export const SONG_LISTS_SONG_MOVED = 'SONG_LISTS_SONG_MOVED';
export const SONG_LISTS_SONG_REMOVED = 'SONG_LISTS_REMOVED';

export function songListsLoad(listKey, order, map) {
  return {
    type: SONG_LISTS_LIST_LOADED,
    listKey,
    map,
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
      const map = {};
      ds.forEach((child) => {
        const value = child.val();
        map[child.key] = new SongState(value).set('votes', new Map(value.votes));
        order.push(child.key);
      });
      dispatch(songListsLoad(listKey, order, map));
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
    const song = Object.assign({}, s, { score: 0, votes: null });
    app.database().ref(`rooms/${roomName}/${listKey}`).push(song);
  };
}

export function downVoteSong(roomName, listKey, songKey, userID, previousVote) {
  return () => {
    let inc = 1;
    if (previousVote === VoteDirections.DOWN) {
      inc = 0;
    } else if (previousVote === VoteDirections.UP) {
      inc = 2;
    }

    app.database().ref(`rooms/${roomName}/${listKey}/${songKey}/score`).transaction(val => val + inc);
    app.database().ref(`rooms/${roomName}/${listKey}/${songKey}/votes/${userID}`).set(VoteDirections.DOWN);
  };
}

export function removeSong(roomName, listKey, songKey) {
  return () => {
    app.database().ref(`rooms/${roomName}/${listKey}/${songKey}`).remove();
  };
}

export function upVoteSong(roomName, listKey, songKey, userID, previousVote) {
  return () => {
    let inc = 1;
    if (previousVote === VoteDirections.DOWN) {
      inc = 2;
    } else if (previousVote === VoteDirections.UP) {
      inc = 0;
    }

    app.database().ref(`rooms/${roomName}/${listKey}/${songKey}/score`).transaction(val => val - inc);
    app.database().ref(`rooms/${roomName}/${listKey}/${songKey}/votes/${userID}`).set(VoteDirections.UP);
  };
}
