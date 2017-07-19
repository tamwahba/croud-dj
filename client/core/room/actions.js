import { checkRoomExists } from '../firebase';
import { watchSongList } from '../song-lists';

export const ROOM_CHANGED = 'ROOM_CHANGED';
export const ROOM_LOADING = 'ROOM_LOADING';

export function roomLoading() {
  return {
    type: ROOM_LOADING,
  };
}

export function roomChanged(name, isValid) {
  return {
    type: ROOM_CHANGED,
    isValid,
    name,
  };
}

export function changeRoom(name, check = checkRoomExists) {
  return (dispatch) => {
    dispatch(roomLoading());

    return check(name)
      .then((ref) => {
        dispatch(roomChanged(ref.key, true));
        dispatch(watchSongList(ref.child('queue').orderByChild('votes'), `${ref.key}-queue`));
        dispatch(watchSongList(ref.child('played'), `${ref.key}-played`));
      })
      .catch(() => dispatch(roomChanged(name, false)));
  };
}
