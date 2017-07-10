/* eslint-env mocha */
import expect from 'expect';
import expectImmutable from 'expect-immutable';

import { firebaseOnline, firebaseOffline } from './actions';
import { FirebaseState, firebaseReducer } from './reducer';

expect.extend(expectImmutable);

describe('core', () => {
  describe('firebase', () => {
    describe('reducer', () => {
      it('should correctly return state when called with undefined', () => {
        const defaultState = new FirebaseState();
        const result = firebaseReducer(undefined, {});
        expect(result).toEqualImmutable(defaultState);
      });

      it('should correctly return state for FIREBASE_ONLINE', () => {
        const newState = new FirebaseState({
          isOnline: true,
        });
        const result = firebaseReducer(undefined, firebaseOnline());
        expect(result).toEqualImmutable(newState);
      });

      it('should correctly return state for FIREBASE_OFFLINE', () => {
        const newState = new FirebaseState({
          isOnline: false,
        });
        const result = firebaseReducer(undefined, firebaseOffline());
        expect(result).toEqualImmutable(newState);
      });
    });
  });
});
