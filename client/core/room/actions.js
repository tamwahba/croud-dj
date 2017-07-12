import { checkRoomExists } from '../firebase';

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
      .then(confirmedName => dispatch(roomChanged(confirmedName, true)))
      .catch(() => dispatch(roomChanged(name, false)));
  };
}
