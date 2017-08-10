/* eslint-env mocha */
import expect from 'expect';

import { MockDatabase, mockDispatch, MockRef } from '../test-utils';

import { ROOM_LOADING,
  ROOM_CHANGED,
  roomChanged,
  roomLoading,
  changeRoom,
  checkRoomExists,
  createRoom,
  watchRoom } from './actions';

describe('core', () => {
  describe('room', () => {
    describe('actions', () => {
      describe('roomLoading', () => {
        it('should return correct action', () => {
          expect(roomLoading()).toEqual({
            type: ROOM_LOADING,
          });
        });
      });

      describe('roomChanged', () => {
        it('should return correct action', () => {
          const isValid = true;
          const name = 'name';
          const owner = 'owner';

          expect(roomChanged(name, isValid, owner)).toEqual({
            type: ROOM_CHANGED,
            isValid,
            name,
            owner,
          });
        });
      });

      describe('watchRoom', () => {
        const name = 'name';
        let mockDatabase;

        beforeEach(() => {
          mockDatabase = new MockDatabase();
        });

        it('should set a value listener on ref `rooms/{name}/owner`', () => {
          watchRoom(name, mockDatabase)(mockDispatch());

          expect(mockDatabase.ref).toHaveBeenCalledWith(`rooms/${name}/owner`);

          expect(mockDatabase.refReturns[0].on.calls[0].arguments[0]).toEqual('value');
        });

        it('should dispatch correct actions when ref `rooms/{name}/owner` exists() is true', () => {
          const expectedActions = [
            roomChanged(),
          ];
          const mockSnapshot = {
            exists: expect.createSpy().andReturn(true),
            ref: new MockRef(`rooms/${name}/owner`),
            val: expect.createSpy().andReturn('owner'),
          };

          watchRoom(name, mockDatabase)(mockDispatch(expectedActions));

          expect(mockDatabase.ref).toHaveBeenCalled();
          expect(mockDatabase.refReturns[0].on).toHaveBeenCalled();
          mockDatabase.refReturns[0].on.calls[0].arguments[1](mockSnapshot);

          expect(expectedActions.length).toEqual(0);
        });

        it('should dispatch correct actions when ref `rooms/{name}/owner` exists() is false', () => {
          const expectedActions = [
            roomChanged(),
          ];
          const mockSnapshot = {
            exists: expect.createSpy().andReturn(false),
          };

          watchRoom(name, mockDatabase)(mockDispatch(expectedActions));

          expect(mockDatabase.ref).toHaveBeenCalled();
          expect(mockDatabase.refReturns[0].on).toHaveBeenCalled();
          mockDatabase.refReturns[0].on.calls[0].arguments[1](mockSnapshot);

          expect(expectedActions.length).toEqual(0);
        });
      });

      describe('changeRoom', () => {
        let mockDatabase;
        let isValid = true;
        let name = 'name';
        const mockGetState = () => ({
          room: {
            name,
            isValid,
          },
        });

        beforeEach(() => {
          isValid = true;
          mockDatabase = new MockDatabase();
          name = 'name';
        });

        it('should dispatch correct actions when state.room.isValid is true', () => {
          const expectedActions = [
            roomLoading(),
          ];

          changeRoom(name, mockDatabase)(mockDispatch(expectedActions), mockGetState);

          expect(mockDatabase.ref).toHaveBeenCalled();
          expect(mockDatabase.refReturns[0].child.calls.length).toEqual(4);
          expect(mockDatabase.refReturns[0].childReturns[0].off).toHaveBeenCalled();
          expect(mockDatabase.refReturns[0].childReturns[1].off).toHaveBeenCalled();
          expect(mockDatabase.refReturns[0].childReturns[2].off).toHaveBeenCalled();
          expect(mockDatabase.refReturns[0].childReturns[3].off).toHaveBeenCalled();

          expect(expectedActions.length).toEqual(0);
        });

        it('should dispatch correct actions when state.room.isValid is false', () => {
          const expectedActions = [
            roomLoading(),
          ];

          isValid = false;

          changeRoom(name, mockDatabase)(mockDispatch(expectedActions), mockGetState);

          expect(mockDatabase.ref).toNotHaveBeenCalled();

          expect(expectedActions.length).toEqual(0);
        });
      });

      describe('checkRoomExists', () => {
        const name = 'name';
        let mockDatabase;

        beforeEach(() => {
          mockDatabase = new MockDatabase();
        });

        it('should return a promise', () => {
          expect(checkRoomExists(name, mockDatabase)()).toBeA(Promise);
        });

        it('should get the value of ref `rooms/{name}/owner` once', () => {
          checkRoomExists(name, mockDatabase)();

          expect(mockDatabase.ref).toHaveBeenCalledWith(`rooms/${name}/owner`);
          expect(mockDatabase.refReturns[0].once).toHaveBeenCalledWith('value');
        });

        it('should check if the ref exists', () => {
          const exists = expect.createSpy().andReturn(true);
          const promise = checkRoomExists(name, mockDatabase)();

          expect(mockDatabase.ref).toHaveBeenCalled();
          expect(mockDatabase.refReturns[0].once).toHaveBeenCalled();

          mockDatabase.refReturns[0].onceReturns[0].resolveWith({ exists });

          return promise.then((value) => {
            expect(exists).toHaveBeenCalled();
            expect(value).toEqual(true);
          });
        });
      });

      describe('createRoom', () => {
        const id = 'id';
        const name = 'name';
        let mockDatabase;

        beforeEach(() => {
          mockDatabase = new MockDatabase();
        });

        it('should return a promise', () => {
          expect(createRoom(name, id, mockDatabase)()).toBeA(Promise);
        });

        it('should set the value of ref `rooms/{name}/owner` to param userID', () => {
          createRoom(name, id, mockDatabase)();

          expect(mockDatabase.ref).toHaveBeenCalledWith(`rooms/${name}/owner`);
          expect(mockDatabase.refReturns[0].set).toHaveBeenCalledWith(id);
        });

        it('should set the value of ref `users/{userID}/rooms/{name}` to true', (done) => {
          const promise = createRoom(name, id, mockDatabase)();

          expect(mockDatabase.ref).toHaveBeenCalled();
          expect(mockDatabase.refReturns[0].set).toHaveBeenCalled();

          mockDatabase.refReturns[0].setReturns[0].resolve();

          mockDatabase.refReturns[0].setReturns[0].promise.then(() => {
            expect(mockDatabase.ref.calls.length).toEqual(2);
            expect(mockDatabase.refReturns[1].set).toHaveBeenCalled();
            mockDatabase.refReturns[1].setReturns[0].resolve();

            promise.then(() => {
              expect(mockDatabase.ref).toHaveBeenCalledWith(`users/${id}/rooms/${name}`);
              expect(mockDatabase.refReturns[1].set).toHaveBeenCalledWith(true);

              done();
            });
          });
        });
      });
    });
  });
});
