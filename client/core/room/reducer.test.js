/* eslint-env mocha */
import expect from 'expect';
import expectImmutable from 'expect-immutable';

import { roomChanged, roomLoading } from './actions';
import { RoomState, roomReducer } from './reducer';

expect.extend(expectImmutable);

describe('core', () => {
  describe('room', () => {
    describe('reducer', () => {
      it('should correctly return state when called with undefined', () => {
        const defaultState = new RoomState();
        const result = roomReducer(undefined, {});
        expect(result).toEqualImmutable(defaultState);
      });

      it('should correctly return state for ROOM_CHANGED', () => {
        const isLoading = false;
        const isValid = true;
        const name = 'name';
        const owner = 'owner';

        const newState = new RoomState({
          isLoading,
          isValid,
          name,
          owner,
        });

        const result = roomReducer(undefined, roomChanged(name, isValid, owner));
        expect(result).toEqualImmutable(newState);
      });

      it('should correctly return state for ROOM_LOADING', () => {
        const name = 'name';

        const initialState = new RoomState({
          isLoading: false,
          isValid: true,
          name,
        });

        const newState = new RoomState({
          isLoading: true,
          isValid: false,
          name,
        });

        const result = roomReducer(initialState, roomLoading());
        expect(result).toEqualImmutable(newState);
      });
    });
  });
});
