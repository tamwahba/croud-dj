/* eslint-env mocha */
import expect from 'expect';

import { loadYoutubePlayerStart,
  loadYoutubePlayerSucceeded,
  loadYoutubePlayerFailed } from './actions';
import { YoutubePlayerState, youtubePlayerReducer } from './reducer';

describe('core', () => {
  describe('youtube', () => {
    describe('player', () => {
      describe('reducer', () => {
        it('should correctly return state when called with undefined', () => {
          const defaultState = new YoutubePlayerState();
          const result = youtubePlayerReducer(undefined, {});
          expect(result).toEqualImmutable(defaultState);
        });

        it('should correctly return state for YOUTUBE_PLAYER_START', () => {
          const newState = new YoutubePlayerState({
            isLoaded: false,
            isLoading: true,
            hasError: false,
            player: null,
          });

          expect(youtubePlayerReducer(undefined, loadYoutubePlayerStart()))
            .toEqualImmutable(newState);
        });

        it('should correctly return state for YOUTUBE_PLAYER_READY', () => {
          const player = { p: 'p' };
          const newState = new YoutubePlayerState({
            isLoaded: true,
            isLoading: false,
            hasError: false,
            player,
          });

          expect(youtubePlayerReducer(undefined, loadYoutubePlayerSucceeded(player)))
            .toEqualImmutable(newState);
        });

        it('should correctly return state for YOUTUBE_PLAYER_ERROR', () => {
          const newState = new YoutubePlayerState({
            isLoaded: false,
            isLoading: false,
            hasError: true,
            player: null,
          });

          expect(youtubePlayerReducer(undefined, loadYoutubePlayerFailed()))
          .toEqualImmutable(newState);
        });
      });
    });
  });
});
