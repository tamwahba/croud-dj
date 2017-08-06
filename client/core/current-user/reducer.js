import { Record } from 'immutable';

import { CURRENT_USER_SIGNED_IN, CURRENT_USER_SIGNED_OUT } from './actions';

export const CurrentUserState = new Record({
  id: '',
  isSignedIn: false,
});

export function currentUserReducer(s = new CurrentUserState(), action) {
  let state = s;

  switch (action.type) {
    case CURRENT_USER_SIGNED_IN:
      state = new CurrentUserState({
        id: action.id,
        isSignedIn: true,
      });
      break;
    case CURRENT_USER_SIGNED_OUT:
      state = new CurrentUserState({
        isSignedIn: false,
      });
      break;
    default:
      break;
  }

  return state;
}
