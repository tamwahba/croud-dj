/* eslint-env mocha */
import expect from 'expect';

import { SONG_LISTS_LIST_LOADED,
  SONG_LISTS_SONG_ADDED,
  SONG_LISTS_SONG_CHANGED,
  SONG_LISTS_SONG_MOVED,
  SONG_LISTS_SONG_REMOVED,
  songListsLoad,
  songListsSongAdd,
  songListsSongChange,
  songListsSongMove,
  songListsSongRemove,
  watchSongList } from './actions';
import { mockDispatch } from '../test-utils';

describe('core', () => {
  describe('song lists', () => {
    describe('actions', () => {
      let listKey;
      let previousSongKey;
      let song;
      let songKey;

      beforeEach(() => {
        listKey = 'list-key';
        previousSongKey = 'previous-song-key';
        song = {
          title: 'song',
        };
        songKey = 'song-key';
      });

      describe('songListsSongAdd', () => {
        it('should return correct action', () => {
          expect(songListsSongAdd(listKey, song, songKey, previousSongKey)).toEqual({
            type: SONG_LISTS_SONG_ADDED,
            listKey,
            previousSongKey,
            song,
            songKey,
          });
        });
      });

      describe('songListsSongChange', () => {
        it('should return correct action', () => {
          expect(songListsSongChange(listKey, song, songKey, previousSongKey)).toEqual({
            type: SONG_LISTS_SONG_CHANGED,
            listKey,
            previousSongKey,
            song,
            songKey,
          });
        });
      });

      describe('songListsSongMove', () => {
        it('should return correct action', () => {
          expect(songListsSongMove(listKey, song, songKey, previousSongKey)).toEqual({
            type: SONG_LISTS_SONG_MOVED,
            listKey,
            previousSongKey,
            song,
            songKey,
          });
        });
      });

      describe('songListsSongRemove', () => {
        it('should return correct action', () => {
          expect(songListsSongRemove(listKey, songKey)).toEqual({
            type: SONG_LISTS_SONG_REMOVED,
            listKey,
            songKey,
          });
        });
      });

      describe('watchSongList', () => {
        const mockFirebase = {
          callbacks: {},
          previousKey: 'key',
          on: (op, callback) => {
            mockFirebase.callbacks[op] = callback;
          },
          once: (op, callback) => {
            callback(mockFirebase.snapshot);
            return Promise.resolve();
          },
          snapshot: {
            key: 'k',
            forEach: () => null,
            val: () => song,
          },
          trigger: (op) => {
            mockFirebase.callbacks[op](mockFirebase.snapshot, mockFirebase.previousKey);
          },
        };

        function mockGetState(retVal) {
          return () => ({
            songLists: {
              get: () => ({
                order: {
                  contains: () => retVal,
                },
              }),
            },
          });
        }

        it('should dispatch correct actions', () => {
          const expectedActions = [
            songListsLoad(),
            songListsSongAdd(),
            songListsSongChange(),
            songListsSongMove(),
            songListsSongRemove(),
          ];

          const watch = watchSongList(mockFirebase, listKey)(
            mockDispatch(expectedActions), mockGetState(false));

          return watch.then(() => {
            mockFirebase.trigger('child_added');
            mockFirebase.trigger('child_changed');
            mockFirebase.trigger('child_moved');
            mockFirebase.trigger('child_removed');

            expect(expectedActions.length).toEqual(0);
          });
        });

        it('should not dispatch SONG_LISTS_SONG_ADDED if child is in state', () => {
          const expectedActions = [
            songListsLoad(),
          ];

          const watch = watchSongList(mockFirebase, listKey)(
            mockDispatch(expectedActions), mockGetState(true));

          return watch.then(() => {
            mockFirebase.trigger('child_added');

            expect(expectedActions.length).toEqual(0);
          });
        });
      });
    });
  });
});
