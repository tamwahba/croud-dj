/* eslint-env mocha */
import expect from 'expect';

import { mockDispatch } from '../../test-utils';
import { SongStatuses } from '../../song';

import { YOUTUBE_PLAYER_START,
  YOUTUBE_PLAYER_READY,
  YOUTUBE_PLAYER_ERROR,
  loadYoutubePlayerStart,
  loadYoutubePlayerSucceeded,
  loadYoutubePlayerFailed,
  loadYoutubePlayer } from './actions';


describe('core', () => {
  describe('youtube', () => {
    describe('player', () => {
      describe('actions', () => {
        describe('loadYoutubePlayerStart', () => {
          it('should return correct action', () => {
            expect(loadYoutubePlayerStart()).toEqual({
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

        describe('loadYoutubePlayer', () => {
          const actions = {
            updateElapsed: expect.createSpy(),
            updateSong: expect.createSpy(),
            updateStatus: expect.createSpy(),
          };

          let events;
          let load;

          function mockInitializeYoutube(_, __, e) {
            events = e;
            return Promise.resolve();
          }

          beforeEach(() => {
            load = loadYoutubePlayer(
              undefined, undefined, undefined, actions, mockInitializeYoutube);
          });

          it('should dispatch correct actions on success', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
            ];

            const promise = load(mockDispatch(expectedActions));

            return promise.then(() => expect(expectedActions.length).toEqual(0));
          });

          it('should dispatch correct actions on failure', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerFailed(),
            ];

            load = loadYoutubePlayer(
              undefined, undefined, undefined, actions, () => Promise.reject());

            const promise = load(mockDispatch(expectedActions));

            return promise.then(() => expect(expectedActions.length).toEqual(0));
          });

          it('should dispatch correct actions on buffering', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
            ];

            const promise = load(mockDispatch(expectedActions));

            events.onBuffering();

            return promise.then(() => {
              expect(expectedActions.length).toEqual(0);
              expect(actions.updateStatus).toHaveBeenCalledWith(SongStatuses.BUFFERING);
            });
          });

          it('should dispatch correct actions on duration update', () => {
            const duration = 10;
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
            ];

            const promise = load(mockDispatch(expectedActions));

            events.onDurationUpdated(duration);

            return promise.then(() => {
              expect(expectedActions.length).toEqual(0);
              expect(actions.updateSong).toHaveBeenCalledWith({ duration });
            });
          });

          it('should dispatch correct actions on error', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
            ];

            const promise = load(mockDispatch(expectedActions));

            events.onError();

            return promise.then(() => {
              expect(expectedActions.length).toEqual(0);
              expect(actions.updateStatus).toHaveBeenCalledWith(SongStatuses.ERROR);
            });
          });

          it('should dispatch correct actions on paused', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
            ];

            const promise = load(mockDispatch(expectedActions));

            events.onPaused();

            return promise.then(() => {
              expect(expectedActions.length).toEqual(0);
              expect(actions.updateStatus).toHaveBeenCalledWith(SongStatuses.PAUSED);
            });
          });

          it('should dispatch correct actions on playing', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
            ];

            const promise = load(mockDispatch(expectedActions));

            events.onPlaying();

            return promise.then(() => {
              expect(expectedActions.length).toEqual(0);
              expect(actions.updateStatus).toHaveBeenCalledWith(SongStatuses.PLAYING);
            });
          });

          it('should dispatch correct actions on time update', () => {
            const elapsed = 10;
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
            ];

            const promise = load(mockDispatch(expectedActions));

            events.onTimeUpdated(elapsed);

            return promise.then(() => {
              expect(expectedActions.length).toEqual(0);
              expect(actions.updateElapsed).toHaveBeenCalledWith(elapsed);
            });
          });
        });
      });
    });
  });
});
