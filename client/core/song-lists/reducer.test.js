/* eslint-env mocha */
import expect from 'expect';
import expectImmutable from 'expect-immutable';
import { List, Map } from 'immutable';

import { songListsLoad,
  songListsSongAdd,
  songListsSongChange,
  songListsSongMove,
  songListsSongRemove } from './actions';
import { SongState, SongListState, songListsReducer } from './reducer';

expect.extend(expectImmutable);

describe('core', () => {
  describe('song lists', () => {
    describe('reducer', () => {
      const listKey = 'list-key';
      const otherListKey = 'other-list-key';
      let newState;
      let song;
      let songKey;

      beforeEach(() => {
        song = { artist: 'artist' };
        songKey = 'song-key';
        newState = new Map({
          [listKey]: new SongListState({
            order: new List(['other-song-key', songKey]),
            songs: new Map({
              [songKey]: new SongState(song),
              'other-song-key': new SongState(),
            }),
          }),
          [otherListKey]: new SongListState({
            order: new List([songKey]),
            songs: new Map({
              [songKey]: new SongState(song),
            }),
          }),
        });
      });

      it('should correctly return state when called with undefined', () => {
        const defaultState = new Map();
        const result = songListsReducer(undefined, {});
        expect(result).toEqualImmutable(defaultState);
      });

      it('should not change state for a different list key', () => {
        const oldState = newState.delete(otherListKey);

        const result = songListsReducer(
          oldState, songListsSongAdd(otherListKey, song, songKey, null));
        expect(result).toEqualImmutable(newState);
      });

      it('should correctly return state for SONG_LISTS_LIST_LOADED', () => {
        const oldState = newState.delete(otherListKey);

        const result = songListsReducer(
          oldState, songListsLoad(otherListKey, [songKey], { [songKey]: new SongState(song) }));
        expect(result).toEqualImmutable(newState);
      });

      it('should correctly return state for SONG_LISTS_SONG_ADDED', () => {
        const oldState = newState.update(listKey, () => (
          new SongListState({
            order: new List(['other-song-key']),
            songs: new Map({ 'other-song-key': new SongState() }),
          })
        ));

        const result = songListsReducer(oldState, songListsSongAdd(listKey, song, songKey, 'other-song-key'));
        expect(result).toEqualImmutable(newState);
      });

      it('should correctly return state for SONG_LISTS_SONG_CHANGED', () => {
        const oldSong = { artist: 'old-artist' };
        const oldState = newState.update(listKey, songList => (
          songList.mergeDeep({
            songs: new Map({
              [songKey]: new SongState(oldSong),
            }),
          })
        ));

        const result = songListsReducer(oldState, songListsSongChange(listKey, song, songKey, 'other-song-key'));
        expect(result).toEqualImmutable(newState);
      });

      it('should correctly return state for SONG_LISTS_SONG_MOVED', () => {
        const oldState = newState.update(listKey, songList => (
          songList.set('order', new List([songKey, 'other-song-key']))
        ));

        const result = songListsReducer(oldState, songListsSongMove(listKey, song, songKey, 'other-song-key'));
        expect(result).toEqualImmutable(newState);
      });

      it('should correctly return state for SONG_LISTS_SONG_REMOVED', () => {
        const oldState = newState.update(listKey, songList => (
          songList.merge({
            order: new List(['other-song-key', songKey, 'third-song-key']),
            songs: new Map({
              [songKey]: new SongState(song),
              'other-song-key': new SongState(),
              'third-song-key': new SongState(),
            }),
          })
        ));

        const result = songListsReducer(oldState, songListsSongRemove(listKey, 'third-song-key'));
        expect(result).toEqualImmutable(newState);
      });
    });
  });
});

