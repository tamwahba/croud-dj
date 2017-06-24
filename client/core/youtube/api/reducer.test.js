/* eslint-env mocha */
import expect from 'expect';
import expectImmutable from 'expect-immutable';

import { fetchYoutubeAPIStart,
  fetchYoutubeAPISucceeded,
  fetchYoutubeAPIFailed } from './actions';
import { YoutubeAPIState, youtubeAPIReducer } from './reducer';

expect.extend(expectImmutable);

describe('core', () => {
  describe('youtube', () => {
    describe('api', () => {
      describe('reducer', () => {
        it('should correctly return state when called with undefined', () => {
          const defaultState = new YoutubeAPIState();
          const result = youtubeAPIReducer(undefined, {});
          expect(result).toEqualImmutable(defaultState);
        });

        it('should correctly return state for YOUTUBE_API_FETCH_START', () => {
          const newState = new YoutubeAPIState({
            api: null,
            isFailed: false,
            isLoaded: false,
            isLoading: true,
          });

          const result = youtubeAPIReducer(undefined, fetchYoutubeAPIStart());
          expect(result).toEqualImmutable(newState);
        });

        it('should correctly return state for YOUTUBE_API_FETCH_SUCCESS', () => {
          const api = {};
          const newState = new YoutubeAPIState({
            api,
            isFailed: false,
            isLoaded: true,
            isLoading: false,
          });

          const result = youtubeAPIReducer(undefined, fetchYoutubeAPISucceeded(api));
          expect(result).toEqualImmutable(newState);
        });

        it('should correctly return state for YOUTUBE_API_FETCH_FAILURE', () => {
          const newState = new YoutubeAPIState({
            api: null,
            isFailed: true,
            isLoaded: false,
            isLoading: false,
          });

          const result = youtubeAPIReducer(undefined, fetchYoutubeAPIFailed());
          expect(result).toEqualImmutable(newState);
        });
      });
    });
  });
});
