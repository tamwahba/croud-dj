/* eslint-env mocha */
import expect from 'expect';
import expectImmutable from 'expect-immutable';

import { currentSongBuffering,
  currentSongElapsed,
  currentSongError,
  currentSongPaused,
  currentSongPlaying,
  currentSongUpdate } from './actions';
import { CurrentSongStatuses, CurrentSongTypes } from './index';
import { CurrentSong, currentSongReducer } from './reducer';

expect.extend(expectImmutable);

describe('core', () => {
  describe('current song', () => {
    describe('reducer', () => {
      it('should correctly return state when called with undefined', () => {
        const defaultState = new CurrentSong();
        const result = currentSongReducer(undefined, {});
        expect(result).toEqualImmutable(defaultState);
      });

      it('should correctly return state for CURRENT_SONG_BUFFERING', () => {
        const newState = new CurrentSong({
          album: '',
          artist: '',
          duration: 0,
          elapsed: 0,
          id: '',
          status: CurrentSongStatuses.BUFFERING,
          title: '',
          type: CurrentSongTypes.YOUTUBE,
        });

        const result = currentSongReducer(undefined, currentSongBuffering());
        expect(result).toEqualImmutable(newState);
      });

      it('should correctly return state for CURRENT_SONG_ELAPSED', () => {
        const time = 10;
        const newState = new CurrentSong({
          album: '',
          artist: '',
          duration: 0,
          elapsed: time,
          id: '',
          status: CurrentSongStatuses.BUFFERING,
          title: '',
          type: CurrentSongTypes.YOUTUBE,
        });

        const result = currentSongReducer(undefined, currentSongElapsed(time));
        expect(result).toEqualImmutable(newState);
      });

      it('should correctly return state for CURRENT_SONG_ERROR', () => {
        const newState = new CurrentSong({
          album: '',
          artist: '',
          duration: 0,
          elapsed: 0,
          id: '',
          status: CurrentSongStatuses.ERROR,
          title: '',
          type: CurrentSongTypes.YOUTUBE,
        });

        const result = currentSongReducer(undefined, currentSongError());
        expect(result).toEqualImmutable(newState);
      });

      it('should correctly return state for CURRENT_SONG_PAUSED', () => {
        const newState = new CurrentSong({
          album: '',
          artist: '',
          duration: 0,
          elapsed: 0,
          id: '',
          status: CurrentSongStatuses.PAUSED,
          title: '',
          type: CurrentSongTypes.YOUTUBE,
        });

        const result = currentSongReducer(undefined, currentSongPaused());
        expect(result).toEqualImmutable(newState);
      });

      it('should correctly return state for CURRENT_SONG_PLAYING', () => {
        const newState = new CurrentSong({
          album: '',
          artist: '',
          duration: 0,
          elapsed: 0,
          id: '',
          status: CurrentSongStatuses.PLAYING,
          title: '',
          type: CurrentSongTypes.YOUTUBE,
        });

        const result = currentSongReducer(undefined, currentSongPlaying());
        expect(result).toEqualImmutable(newState);
      });

      it('should correctly return state for CURRENT_SONG_UPDATE', () => {
        const song = {
          album: '',
          artist: '',
          duration: 10,
          elapsed: 5,
          id: 'song',
          status: CurrentSongStatuses.PLAYING,
          title: '',
          type: CurrentSongTypes.YOUTUBE,
        };
        const newState = new CurrentSong(song);

        const result = currentSongReducer(undefined, currentSongUpdate(song));
        expect(result).toEqualImmutable(newState);
      });

      it('should ignore any unknown properties for CURRENT_SONG_UPDATE', () => {
        const song = {
          album: '',
          artist: '',
          duration: 10,
          elapsed: 5,
          id: 'song',
          status: CurrentSongStatuses.PLAYING,
          title: '',
          type: CurrentSongTypes.YOUTUBE,
        };
        const newState = new CurrentSong(Object.assign({}, song, { other: 'prop' }));

        const result = currentSongReducer(undefined, currentSongUpdate(song));
        expect(result).toEqualImmutable(newState);
      });

      it('should merge old and new properties for CURRENT_SONG_UPDATE', () => {
        const oldSong = {
          album: '',
          artist: '',
          duration: 0,
          elapsed: 0,
          id: 'song',
          status: CurrentSongStatuses.PLAYING,
          title: '',
          type: CurrentSongTypes.YOUTUBE,
        };
        const update = { duration: 10 };
        const newState = new CurrentSong(Object.assign({}, oldSong, update));

        const result = currentSongReducer(new CurrentSong(oldSong), currentSongUpdate(update));
        expect(result).toEqualImmutable(newState);
      });
    });
  });
});
