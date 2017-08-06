/* eslint-env mocha */
import expect from 'expect';

import { SongStatuses } from '../song';
import { MockDatabase, mockDispatch, MockRef } from '../test-utils';

import { CURRENT_SONG_UPDATE,
  currentSongUpdate,
  changeCurrentSong,
  pauseCurrentSong,
  playCurrentSong,
  updateCurrentSong,
  updateCurrentSongElapsed,
  updateCurrentSongStatus,
  watchCurrentSong } from './actions';

describe('core', () => {
  describe('current-song', () => {
    describe('actions', () => {
      let mockDatabase;
      let roomName;

      function mockGetState() {
        return {
          currentSong: {
            merge: () => ({
              toJS: () => ({}),
            }),
            status: SongStatuses.EMPTY,
          },
          room: {
            name: roomName,
          },
        };
      }

      beforeEach(() => {
        mockDatabase = new MockDatabase();
        roomName = 'name';
      });

      describe('currentSongUpdate', () => {
        it('should return correct action', () => {
          const song = { title: 't' };
          expect(currentSongUpdate(song)).toEqual({
            type: CURRENT_SONG_UPDATE,
            song,
          });
        });
      });

      describe('watchCurrentSong', () => {
        it('should dispatch correct action on value', () => {
          const expectedActions = [
            currentSongUpdate(),
          ];
          const mockRef = new MockRef();

          watchCurrentSong(mockRef)(mockDispatch(expectedActions));

          expect(mockRef.on).toHaveBeenCalled();

          mockRef.on.calls[0].arguments[1]({ val: () => '' });

          expect(expectedActions.length).toEqual(0);
        });
      });

      describe('changeCurrentSong', () => {
        it('should update firebase ref', () => {
          const song = { title: 't' };
          changeCurrentSong(song, mockDatabase)(undefined, mockGetState);

          expect(mockDatabase.ref).toHaveBeenCalled();
          expect(mockDatabase.refReturns[0].set).toHaveBeenCalledWith(song);
        });
      });

      describe('updateCurrentSong', () => {
        it('should update firebase ref', () => {
          updateCurrentSong({}, mockDatabase)(undefined, mockGetState);

          expect(mockDatabase.ref).toHaveBeenCalled();
          expect(mockDatabase.refReturns[0].set).toHaveBeenCalled();
        });
      });

      describe('updateCurrentSongElapsed', () => {
        it('should update firebase ref', () => {
          const elapsed = 10;
          updateCurrentSongElapsed(elapsed, mockDatabase)(undefined, mockGetState);

          expect(mockDatabase.ref).toHaveBeenCalled();
          expect(mockDatabase.refReturns[0].set).toHaveBeenCalledWith(elapsed);
        });
      });

      describe('updateCurrentSongStatus', () => {
        it('should update firebase ref', () => {
          const status = SongStatuses.PLAYING;
          updateCurrentSongStatus(status, mockDatabase)(undefined, mockGetState);

          expect(mockDatabase.ref).toHaveBeenCalled();
          expect(mockDatabase.refReturns[0].set).toHaveBeenCalledWith(status);
        });

        it('should not update when status matches state', () => {
          const status = SongStatuses.EMPTY;
          updateCurrentSongStatus(status, mockDatabase)(undefined, mockGetState);

          expect(mockDatabase.ref).toNotHaveBeenCalled();
        });
      });

      describe('pauseCurrentSong', () => {
        it('should act as an alias for updateCurrentSongStatus', () => {
          expect(pauseCurrentSong(mockDatabase)).toEqual(
            updateCurrentSongStatus(SongStatuses.PAUSED, mockDatabase));
        });
      });

      describe('playCurrentSong', () => {
        it('should act as an alias for updateCurrentSongStatus', () => {
          expect(playCurrentSong(mockDatabase)).toEqual(
            updateCurrentSongStatus(SongStatuses.PLAYING, mockDatabase));
        });
      });
    });
  });
});
