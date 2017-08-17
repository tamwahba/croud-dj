import { List, Map, Record } from 'immutable';

import { USERS_USER_ADD,
  USERS_USER_REMOVE,
  USERS_USER_UPDATE } from './actions';

export const UserState = new Record({
  id: '',
  isAnonymous: true,
  friendIDs: new List(),
  name: 'Anonymous User',
  nickname: 'anonymous',
  photo: '',
  roomIDs: new List(),
});

export function usersReducer(s = new Map(), action) {
  let state = s;
  let userState;

  switch (action.type) {
    case USERS_USER_ADD:
      userState = new UserState(action.user)
        .set('friendIDs', new List(Object.keys(action.user.friends || {})))
        .set('roomIDs', new List(Object.keys(action.user.rooms || {})));
      state = state.set(action.user.id, userState);
      break;
    case USERS_USER_REMOVE:
      state = state.delete(action.id);
      break;
    case USERS_USER_UPDATE:
      userState = new UserState(action.user)
        .set('friendIDs', new List(Object.keys(action.user.friends || {})))
        .set('roomIDs', new List(Object.keys(action.user.rooms || {})));
      state = state.mergeDeep({
        [action.user.id]: userState,
      });
      break;
    default:
      break;
  }

  return state;
}
