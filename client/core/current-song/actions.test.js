/* eslint-env mocha */
import expect from 'expect';

import { CURRENT_SONG_BUFFERING,
  CURRENT_SONG_ELAPSED,
  CURRENT_SONG_ERROR,
  CURRENT_SONG_PAUSED,
  CURRENT_SONG_PLAYING,
  CURRENT_SONG_UPDATE,
  currentSongBuffering,
  currentSongElapsed,
  currentSongError,
  currentSongPaused,
  currentSongPlaying,
  currentSongUpdate } from './actions';

describe('core', () => {
  describe('current song', () => {
    describe('action producers', () => {
      describe('currentSongBuffering', () => {
        it('should return correct action', () => {
          expect(currentSongBuffering()).toEqual({
            type: CURRENT_SONG_BUFFERING,
          });
        });
      });

      describe('currentSongElapsed', () => {
        it('should return correct action', () => {
          const time = 12;

          expect(currentSongElapsed(time)).toEqual({
            type: CURRENT_SONG_ELAPSED,
            elapsed: time,
          });
        });
      });

      describe('currentSongError', () => {
        it('should return correct action', () => {
          expect(currentSongError()).toEqual({
            type: CURRENT_SONG_ERROR,
          });
        });
      });

      describe('currentSongPaused', () => {
        it('should return correct action', () => {
          expect(currentSongPaused()).toEqual({
            type: CURRENT_SONG_PAUSED,
          });
        });
      });

      describe('currentSongPlaying', () => {
        it('should return correct action', () => {
          expect(currentSongPlaying()).toEqual({
            type: CURRENT_SONG_PLAYING,
          });
        });
      });

      describe('currentSongUpdate', () => {
        it('should return correct action', () => {
          const song = { song: 's' };

          expect(currentSongUpdate(song)).toEqual({
            type: CURRENT_SONG_UPDATE,
            song,
          });
        });
      });
    });
  });
});
