/* eslint-env mocha */
import expect from 'expect';

import { YOUTUBE_PLAYER_START,
  YOUTUBE_PLAYER_READY,
  YOUTUBE_PLAYER_ERROR,
  loadYoutubePlayer,
  loadYoutubePlayerSucceeded,
  loadYoutubePlayerFailed } from './actions';

describe('core', () => {
  describe('youtube', () => {
    describe('player', () => {
      describe('action producers', () => {
        describe('loadYoutubePlayer', () => {
          it('should return correct action', () => {
            expect(loadYoutubePlayer()).toEqual({
              type: YOUTUBE_PLAYER_START,
            });
          });
        });

        describe('loadYoutubePlayerSucceeded', () => {
          it('should return correct action', () => {
            const player = {};

            expect(loadYoutubePlayerSucceeded(player)).toEqual({
              type: YOUTUBE_PLAYER_READY,
              player,
            });
          });
        });

        describe('loadYoutubePlayerFailed', () => {
          it('should return correct action', () => {
            expect(loadYoutubePlayerFailed()).toEqual({
              type: YOUTUBE_PLAYER_ERROR,
            });
          });
        });
      });
    });
  });
});
