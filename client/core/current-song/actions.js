import { app } from '../firebase';
import { SongStatuses } from '../song';

export const CURRENT_SONG_UPDATE = 'CURRENT_SONG_UPDATE';

export function currentSongUpdate(song) {
  return {
    type: CURRENT_SONG_UPDATE,
    song,
  };
}

export function watchCurrentSong(firebaseRef) {
  return (dispatch) => {
    firebaseRef.on('value', (ds) => {
      dispatch(currentSongUpdate(ds.val()));
    });
  };
}

export function changeCurrentSong(song, database = app.database()) {
  return (_, getState) => {
    const roomName = getState().room.name;
    database.ref(`rooms/${roomName}/nowPlaying`).set(song);
  };
}

export function updateCurrentSong(s, database = app.database()) {
  return (_, getState) => {
    const song = getState().currentSong.merge(s).toJS();
    const roomName = getState().room.name;
    database.ref(`rooms/${roomName}/nowPlaying`).set(song);
  };
}

export function updateCurrentSongElapsed(elapsed, database = app.database()) {
  return (_, getState) => {
    const roomName = getState().room.name;
    database.ref(`rooms/${roomName}/nowPlaying/elapsed`).set(elapsed);
  };
}

export function updateCurrentSongStatus(status, database = app.database()) {
  return (_, getState) => {
    if (getState().currentSong.status !== status) {
      const roomName = getState().room.name;
      database.ref(`rooms/${roomName}/nowPlaying/status`).set(status);
    }
  };
}

export function pauseCurrentSong(database = app.database()) {
  return updateCurrentSongStatus(SongStatuses.PAUSED, database);
}

export function playCurrentSong(database = app.database()) {
  return updateCurrentSongStatus(SongStatuses.PLAYING, database);
}

