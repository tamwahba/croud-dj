/* eslint-env mocha */
import expect from 'expect';

import { MockDatabase, mockDispatch } from '../test-utils';

import { USERS_USER_ADD,
  USERS_USER_REMOVE,
  USERS_USER_UPDATE,
  usersUserAdd,
  usersUserRemove,
  usersUserUpdate,
  updateUser,
  watchUser } from './actions';

describe('core', () => {
  describe('users', () => {
    describe('actions', () => {
      describe('usersUserAdd', () => {
        it('should return correct action', () => {
          const user = {};
          expect(usersUserAdd(user)).toEqual({
            type: USERS_USER_ADD,
            user,
          });
        });
      });

      describe('usersUserRemove', () => {
        it('should return correct action', () => {
          const user = {};
          expect(usersUserUpdate(user)).toEqual({
            type: USERS_USER_UPDATE,
            user,
          });
        });
      });

      describe('usersUserUpdate', () => {
        it('should return correct action', () => {
          const id = '';
          expect(usersUserRemove(id)).toEqual({
            type: USERS_USER_REMOVE,
            id,
          });
        });
      });

      describe('updateUser', () => {
        it('should call update on ref `users/{user.id}`', () => {
          const id = 'id';
          const mockDatabase = new MockDatabase();
          const name = 'name';

          updateUser({ id, name }, mockDatabase)();

          expect(mockDatabase.ref).toHaveBeenCalledWith(`users/${id}`);
          expect(mockDatabase.refReturns[0].update).toHaveBeenCalledWith({ id, name });
        });
      });

      describe('watchUser', () => {
        const id = 'id';
        let mockDatabase;

        beforeEach(() => {
          mockDatabase = new MockDatabase();
        });

        it('should set a value listener on ref `users/{user.id}`', () => {
          watchUser(id, false, mockDatabase)(mockDispatch());

          expect(mockDatabase.ref).toHaveBeenCalledWith(`users/${id}`);

          expect(mockDatabase.refReturns[0].on.calls[0].arguments[0]).toEqual('value');
        });

        it('should dispatch correct actions when ref `user/{id}` exists() is true', () => {
          const friendKeys = ['f1', 'f2'];
          const mockSnapshot = {
            child: () => friendKeys,
            exists: expect.createSpy().andReturn(true),
            val: () => id,
          };
          const spyDispatch = expect.createSpy();

          watchUser(id, true, mockDatabase)(spyDispatch);

          expect(mockDatabase.ref).toHaveBeenCalled();
          expect(mockDatabase.refReturns[0].on).toHaveBeenCalled();
          mockDatabase.refReturns[0].on.calls[0].arguments[1](mockSnapshot);

          expect(spyDispatch.calls.length).toEqual(3);
        });

        it('should dispatch correct actions when ref `user/{id}` exists() is true', () => {
          const friendKeys = ['f1', 'f2'];
          const mockSnapshot = {
            child: () => friendKeys,
            exists: expect.createSpy().andReturn(true),
            val: () => id,
          };
          const spyDispatch = expect.createSpy();

          watchUser(id, false, mockDatabase)(spyDispatch);

          expect(mockDatabase.ref).toHaveBeenCalled();
          expect(mockDatabase.refReturns[0].on).toHaveBeenCalled();
          mockDatabase.refReturns[0].on.calls[0].arguments[1](mockSnapshot);

          expect(spyDispatch.calls.length).toEqual(1);
        });

        it('should not dispatch actions when ref `user/{id}` exists() is false', () => {
          const mockSnapshot = {
            exists: expect.createSpy().andReturn(false),
          };

          watchUser(id, false, mockDatabase)(mockDispatch());

          expect(mockDatabase.ref).toHaveBeenCalled();
          expect(mockDatabase.refReturns[0].on).toHaveBeenCalled();
          mockDatabase.refReturns[0].on.calls[0].arguments[1](mockSnapshot);

          expect(mockSnapshot.exists).toHaveBeenCalled();
        });
      });
    });
  });
});
