import { watchCurrentSong } from '../current-song';
import { app } from '../firebase';
import { watchSongList } from '../song-lists';

export const ROOM_CHANGED = 'ROOM_CHANGED';
export const ROOM_LOADING = 'ROOM_LOADING';

export function roomLoading() {
  return {
    type: ROOM_LOADING,
  };
}

export function roomChanged(name, isValid, owner) {
  return {
    type: ROOM_CHANGED,
    isValid,
    name,
    owner,
  };
}

export function checkRoomExists(name, database = app.database()) {
  return () =>
    database.ref(`rooms/${name}/owner`)
      .once('value')
      .then(ds => ds.exists());
}

export function createRoom(name, userID, database = app.database()) {
  return () =>
    database.ref(`rooms/${name}/owner`)
      .set(userID)
      .then(() => database.ref(`users/${userID}/rooms/${name}`).set(true));
}


export function watchRoom(name, database = app.database()) {
  return (dispatch) => {
    database.ref(`rooms/${name}/owner`).on('value', (ds) => {
      if (ds.exists()) {
        const ref = ds.ref.parent;
        dispatch(roomChanged(ref.key, true, ds.val()));
        dispatch(watchCurrentSong(ref.child('nowPlaying')));
        dispatch(watchSongList(ref.child('queue').orderByChild('score'), `${ref.key}-queue`));
        dispatch(watchSongList(ref.child('played'), `${ref.key}-played`));
      } else {
        dispatch(roomChanged(name, false));
      }
    });
  };
}

export function changeRoom(name, database = app.database()) {
  return (dispatch, getState) => {
    const room = getState().room;
    dispatch(roomLoading());
    if (room.isValid) {
      const ref = database.ref(`rooms/${room.name}`);
      ref.child('nowPlaying').off();
      ref.child('owner').off();
      ref.child('played').off();
      ref.child('queue').off();
    }
    dispatch(watchRoom(name, database));
  };
}
