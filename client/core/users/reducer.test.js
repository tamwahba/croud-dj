/* eslint-env mocha */
import expect from 'expect';
import expectImmutable from 'expect-immutable';
import { List, Map } from 'immutable';

import { usersUserAdd, usersUserRemove, usersUserUpdate } from './actions';
import { UserState, usersReducer } from './reducer';

expect.extend(expectImmutable);

describe('core', () => {
  describe('users', () => {
    describe('reducer', () => {
      const user1 = new UserState({ id: '1' });
      const user2 = new UserState({ id: '2' });
      const user3 = new UserState({ id: '3' });
      const initialState = new Map({
        1: user1,
        2: user2,
      });

      beforeEach(() => {

      });

      it('should correctly return state when called with undefined', () => {
        const defaultState = new Map();
        const result = usersReducer(undefined, {});
        expect(result).toEqualImmutable(defaultState);
      });

      it('should correctly return state for USERS_USER_ADD', () => {
        const newState = initialState.set(3, user3);
        const result = usersReducer(initialState, usersUserAdd(user3.toJS()));

        expect(result).toEqualImmutable(newState);
      });

      it('should correctly return state for USERS_USER_REMOVE', () => {
        const newState = initialState.delete(1);
        const result = usersReducer(initialState, usersUserRemove(1));

        expect(result).toEqualImmutable(newState);
      });

      it('should correctly return state for USERS_USER_UPDATE', () => {
        const newState = initialState.set(1, user1.set('friendIDs', new List(['f1', 'f2'])));
        const result = usersReducer(initialState, usersUserUpdate({
          id: '1',
          friends: {
            f1: true,
            f2: true,
          },
        }));

        expect(result).toEqualImmutable(newState);
      });
    });
  });
});
