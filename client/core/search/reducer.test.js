/* eslint-env mocha */
import expect from 'expect';
import expectImmutable from 'expect-immutable';
import { List } from 'immutable';

import { SongState } from '../song';

import { searchClear, searchStart, searchSucceeded, searchFailed } from './actions';
import { SearchState, searchReducer } from './reducer';

expect.extend(expectImmutable);

describe('core', () => {
  describe('selected song', () => {
    describe('reducer', () => {
      const initialState = new SearchState({
        results: new List([new SongState()]),
      });

      it('should correctly return state when called with undefined', () => {
        const defaultState = new SearchState();
        const result = searchReducer(undefined, {});
        expect(result).toEqualImmutable(defaultState);
      });

      it('should correctly return state for SEARCH_CLEAR', () => {
        const defaultState = new SearchState();
        const result = searchReducer(initialState, searchClear());
        expect(result).toEqualImmutable(defaultState);
      });

      it('should correctly return state for SEARCH_START', () => {
        const query = 'q';
        const expectedState = new SearchState({
          isLoading: true,
          query,
        });

        const result = searchReducer(initialState, searchStart(query));
        expect(result).toEqualImmutable(expectedState);
      });

      it('should correctly return state for SEARCH_SUCCESS', () => {
        const results = new List([new SongState(), new SongState()]);
        const expectedState = new SearchState({
          isLoading: false,
          results,
        });

        const result = searchReducer(initialState, searchSucceeded(results));
        expect(result).toEqualImmutable(expectedState);
      });

      it('should correctly return state for SEARCH_FAILURE', () => {
        const expectedState = new SearchState({
          isLoading: false,
        });

        const result = searchReducer(initialState, searchFailed());
        expect(result).toEqualImmutable(expectedState);
      });
    });
  });
});
