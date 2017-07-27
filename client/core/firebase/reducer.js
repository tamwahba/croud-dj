import { Record } from 'immutable';

import { FIREBASE_ONLINE, FIREBASE_OFFLINE } from './actions';

export const FirebaseState = new Record({
  isOnline: false,
});

export function firebaseReducer(s = new FirebaseState(), action) {
  let state = s;
  switch (action.type) {
    case FIREBASE_ONLINE:
      state = state.set('isOnline', true);
      break;
    case FIREBASE_OFFLINE:
      state = state.set('isOnline', false);
      break;
    default:
      break;
  }

  return state;
}
