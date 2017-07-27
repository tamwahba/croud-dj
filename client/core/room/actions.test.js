/* eslint-env mocha */
import expect from 'expect';

import { ROOM_LOADING,
  ROOM_CHANGED,
  roomChanged,
  roomLoading,
  changeRoom } from './actions';
import { mockDispatch } from '../test-utils';

describe('core', () => {
  describe('selected room', () => {
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

          expect(roomChanged(name, isValid)).toEqual({
            type: ROOM_CHANGED,
            isValid,
            name,
          });
        });
      });

      describe('changeRoom', () => {
        let shouldFail;

        function mockCheck(name) {
          if (shouldFail) {
            return Promise.reject();
          }
          return Promise.resolve(name);
        }

        beforeEach(() => {
          shouldFail = false;
        });

        it('should dispatch correct actions on success', () => {
          const expectedActions = [
            roomLoading(),
            roomChanged(),
            roomChanged(), // happens when thunk dispatches fail
          ];
          const name = 'name';

          return changeRoom(name, mockCheck)(mockDispatch(expectedActions))
            .then(() => expect(expectedActions.length).toEqual(0));
        });

        it('should dispatch correct actions on failure', () => {
          const expectedActions = [
            roomLoading(),
            roomChanged(),
          ];
          const name = 'name';

          shouldFail = true;

          return changeRoom(name, mockCheck)(mockDispatch(expectedActions))
            .then(() => expect(expectedActions.length).toEqual(0));
        });
      });
    });
  });
});
