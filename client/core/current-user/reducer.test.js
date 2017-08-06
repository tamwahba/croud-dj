/* eslint-env mocha */
import expect from 'expect';
import expectImmutable from 'expect-immutable';

import { currentUserSignedIn, currentUserSignedOut } from './actions';
import { currentUserReducer, CurrentUserState } from './reducer';

expect.extend(expectImmutable);

describe('core', () => {
  describe('current-user', () => {
    describe('reducer', () => {
      it('should correctly return state when called with undefined', () => {
        const defaultState = new CurrentUserState();
        const result = currentUserReducer(undefined, {});
        expect(result).toEqualImmutable(defaultState);
      });

      it('should correctly return state for CURRENT_USER_SIGNED_IN', () => {
        const id = 'id';
        const newState = new CurrentUserState({
          id,
          isSignedIn: true,
        });
        const result = currentUserReducer(new CurrentUserState(), currentUserSignedIn(id));
        expect(result).toEqualImmutable(newState);
      });

      it('should correctly return state for CURRENT_USER_SIGNED_OUT', () => {
        const newState = new CurrentUserState({
          id: '',
          isSignedIn: false,
        });
        const result = currentUserReducer(new CurrentUserState(), currentUserSignedOut());
        expect(result).toEqualImmutable(newState);
      });
    });
  });
});
