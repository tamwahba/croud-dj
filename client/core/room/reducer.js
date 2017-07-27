import { Record } from 'immutable';

import { ROOM_CHANGED, ROOM_LOADING } from './actions';

export const RoomState = new Record({
  isLoading: true,
  isValid: false,
  name: '',
});

export function roomReducer(s = new RoomState(), action) {
  let state = s;
  switch (action.type) {
    case ROOM_CHANGED:
      state = new RoomState({
        isLoading: false,
        isValid: action.isValid,
        name: action.name,
      });
      break;
    case ROOM_LOADING:
      state = state.set('isLoading', true);
      state = state.set('isValid', false);
      break;
    default:
      break;
  }

  return state;
}
