/* eslint-env mocha */
import expect from 'expect';

import { MockDatabase, mockDispatch } from '../test-utils';

import { CURRENT_USER_SIGNED_IN,
  CURRENT_USER_SIGNED_OUT,
  currentUserSignedIn,
  currentUserSignedOut,
  watchCurrentUser } from './actions';

describe('core', () => {
  describe('curent-user', () => {
    describe('currentUserSignedIn', () => {
      it('should return correct action', () => {
        const id = 'id';
        expect(currentUserSignedIn(id)).toEqual({
          type: CURRENT_USER_SIGNED_IN,
          id,
        });
      });
    });

    describe('currentUserSignedOut', () => {
      it('should return correct action', () => {
        expect(currentUserSignedOut()).toEqual({
          type: CURRENT_USER_SIGNED_OUT,
        });
      });
    });

    describe('watchCurrentUser', () => {
      const mockAuth = {
        onAuthStateChanged: expect.createSpy().andCall((cb) => { mockAuth.triggerChange = cb; }),
        signInAnonymously: expect.createSpy(),
      };

      it('should dispatch correct actions on login', () => {
        const expectedActions = [
          currentUserSignedIn(),
        ];
        const user = {
          uid: 'uid',
          isAnonymous: true,
          displayName: 'displayName',
          photoURL: 'photoURL',
        };

        watchCurrentUser(mockAuth, new MockDatabase())(mockDispatch(expectedActions));

        expect(mockAuth.onAuthStateChanged).toHaveBeenCalled();

        mockAuth.triggerChange(user);

        expect(expectedActions.length).toEqual(0);
      });

      it('should sign in anonymously on logout', () => {
        watchCurrentUser(mockAuth, new MockDatabase());

        mockAuth.triggerChange(null);

        expect(mockAuth.signInAnonymously).toHaveBeenCalled();
      });
    });
  });
});
