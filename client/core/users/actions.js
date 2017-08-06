import { app } from '../firebase';

export const USERS_USER_ADD = 'USERS_USER_ADD';
export const USERS_USER_REMOVE = 'USERS_USER_REMOVE';
export const USERS_USER_UPDATE = 'USERS_USER_UPDATE';

export function usersUserAdd(user) {
  return {
    type: USERS_USER_ADD,
    user,
  };
}

export function usersUserRemove(id) {
  return {
    type: USERS_USER_REMOVE,
    id,
  };
}

export function usersUserUpdate(user) {
  return {
    type: USERS_USER_UPDATE,
    user,
  };
}

export function updateUser(user, database = app.database()) {
  return () =>
    database.ref(`users/${user.id}`)
      .update(user);
}

export function watchUser(id, watchFriends = false, database = app.database()) {
  return (dispatch) => {
    database.ref(`users/${id}`).on('value', (ds) => {
      if (ds.exists()) {
        dispatch(usersUserUpdate(ds.val()));
        if (watchFriends) {
          ds.child('friends').forEach(friend => dispatch(watchUser(friend.key, false, database)));
        }
      }
    });
  };
}
