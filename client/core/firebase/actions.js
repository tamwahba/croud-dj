import { app } from './service';

export const FIREBASE_ONLINE = 'FIREBASE_ONLINE';
export const FIREBASE_OFFLINE = 'FIREBASE_OFFLINE';

export function firebaseOnline() {
  return {
    type: FIREBASE_ONLINE,
  };
}

export function firebaseOffline() {
  return {
    type: FIREBASE_OFFLINE,
  };
}

export function watchFirebase(database = app.database()) {
  return (dispatch) => {
    database.ref('.info/connected').on('value', (ds) => {
      if (ds.val()) {
        dispatch(firebaseOnline());
      } else {
        dispatch(firebaseOffline());
      }
    });
  };
}
