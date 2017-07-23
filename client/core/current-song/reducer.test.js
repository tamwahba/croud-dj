/* eslint-env mocha */
import expect from 'expect';
import expectImmutable from 'expect-immutable';

import { SongServices, SongState, SongStatuses } from '../song';

import { currentSongUpdate } from './actions';
import { currentSongReducer } from './reducer';

expect.extend(expectImmutable);

describe('core', () => {
  describe('current song', () => {
    describe('reducer', () => {
      it('should correctly return state when called with undefined', () => {
        const defaultState = new SongState();
        const result = currentSongReducer(undefined, {});
        expect(result).toEqualImmutable(defaultState);
      });

      it('should correctly return state for CURRENT_SONG_UPDATE', () => {
        const song = {
          artist: '',
          duration: 10,
          elapsed: 5,
          id: 'song',
          status: SongStatuses.PLAYING,
          title: '',
          service: SongServices.YOUTUBE,
        };
        const newState = new SongState(song);

        const result = currentSongReducer(undefined, currentSongUpdate(song));
        expect(result).toEqualImmutable(newState);
      });
    });
  });
});
