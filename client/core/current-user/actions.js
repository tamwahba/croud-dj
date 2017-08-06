import { app } from '../firebase';
import { updateUser, watchUser } from '../users';

export const CURRENT_USER_SIGNED_IN = 'CURRENT_USER_SIGNED_IN';
export const CURRENT_USER_SIGNED_OUT = 'CURRENT_USER_SIGNED_OUT';

export function currentUserSignedIn(id) {
  return {
    type: CURRENT_USER_SIGNED_IN,
    id,
  };
}

export function currentUserSignedOut() {
  return {
    type: CURRENT_USER_SIGNED_OUT,
  };
}

export function watchCurrentUser(auth = app.auth(), database = app.database()) {
  return (dispatch) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const userInfo = {
          id: user.uid,
          isAnonymous: user.isAnonymous,
          nickname: user.displayName,
          photo: user.photoURL,
        };

        dispatch(updateUser(userInfo, database));
        dispatch(watchUser(userInfo.id, true, database));
        dispatch(currentUserSignedIn(userInfo.id));
      } else {
        auth.signInAnonymously();
      }
    });
  };
}
