/* eslint-env mocha */
import expect from 'expect';

import { YOUTUBE_PLAYER_START,
  YOUTUBE_PLAYER_READY,
  YOUTUBE_PLAYER_ERROR,
  loadYoutubePlayerStart,
  loadYoutubePlayerSucceeded,
  loadYoutubePlayerFailed,
  loadYoutubePlayer } from './actions';
import { mockDispatch } from '../../test-utils';

describe('core', () => {
  describe('youtube', () => {
    describe('player', () => {
      describe('action producers', () => {
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
          let player;

          function MockPlayer(contaier, { events }) {
            player = {
              buffer: () => events.onStateChange({ data: 3 }),
              end: () => events.onStateChange({ data: 0 }),
              error: () => events.onError(),
              getDuration: () => 10,
              getCurrentTime: () => 1,
              unknown: () => events.onStateChange({ data: -10 }),
              unstart: () => events.onStateChange({ data: -1 }),
              play: () => events.onStateChange({ data: 1 }),
              pause: () => events.onStateChange({ data: 2 }),
              queue: () => events.onStateChange({ data: 4 }),
              ready: () => events.onReady(),
            };

            return player;
          }

          const api = {
            Player: MockPlayer,
          };
          const state = {
            currentSong: {
              status: 'BUFFERING',
            },
          };
          const getState = () => state;

          afterEach(() => {
            player = undefined;
          });

          it('should dispatch correct actions on success', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
            ];

            const load = loadYoutubePlayer(api, 'container', true)(mockDispatch(expectedActions), getState);

            player.ready();

            return load.then(() => expect(expectedActions.length).toEqual(0));
          });

          it('should dispatch correct actions on error', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              { type: 'CURRENT_SONG_ERROR' },
              loadYoutubePlayerFailed(),
            ];

            const load = loadYoutubePlayer(api, 'container', true)(mockDispatch(expectedActions), getState);

            player.error();

            return load.then(() => expect(expectedActions.length).toEqual(0));
          });

          it('should dispatch correct actions on buffering', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
              { type: 'CURRENT_SONG_BUFFERING' },
            ];

            const load = loadYoutubePlayer(api, 'container', true)(mockDispatch(expectedActions), getState);

            player.ready();

            return load
              .then(() => player.buffer())
              .then(() => expect(expectedActions.length).toEqual(0));
          });

          it('should dispatch correct actions on ended', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
              { type: 'CURRENT_SONG_PAUSED' },
            ];

            const load = loadYoutubePlayer(api, 'container', true)(mockDispatch(expectedActions), getState);

            player.ready();

            return load
              .then(() => player.end())
              .then(() => expect(expectedActions.length).toEqual(0));
          });

          it('should dispatch no actions on unknown', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
            ];

            const load = loadYoutubePlayer(api, 'container', true)(mockDispatch(expectedActions), getState);

            player.ready();

            return load
              .then(() => player.unknown())
              .then(() => expect(expectedActions.length).toEqual(0));
          });

          it('should dispatch correct actions on paused', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
              { type: 'CURRENT_SONG_PAUSED' },
            ];

            const load = loadYoutubePlayer(api, 'container', true)(mockDispatch(expectedActions), getState);

            player.ready();

            return load
              .then(() => player.pause())
              .then(() => expect(expectedActions.length).toEqual(0));
          });

          it('should dispatch correct actions on playing', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
              { type: 'CURRENT_SONG_PLAYING' },
              { type: 'CURRENT_SONG_UPDATE' },
              { type: 'CURRENT_SONG_PAUSED' },
            ];

            const load = loadYoutubePlayer(api, 'container', true)(mockDispatch(expectedActions), getState);

            player.ready();

            return load
              .then(() => {
                player.play();
                player.pause();
              }).then(() => expect(expectedActions.length).toEqual(0));
          });

          it('should dispatch correct actions on queued', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
            ];

            const load = loadYoutubePlayer(api, 'container', true)(mockDispatch(expectedActions), getState);

            player.ready();

            return load
              .then(() => {
                player.queue();
              }).then(() => expect(expectedActions.length).toEqual(0));
          });

          it('should dispatch correct actions on unstarted', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
            ];

            const load = loadYoutubePlayer(api, 'container', true)(mockDispatch(expectedActions), getState);

            player.ready();

            return load
              .then(() => player.unstart())
              .then(() => expect(expectedActions.length).toEqual(0));
          });

          it('should dispatch correct actions on update time', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
              { type: 'CURRENT_SONG_PLAYING' },
              { type: 'CURRENT_SONG_UPDATE' },
              { type: 'CURRENT_SONG_ELAPSED' },
              { type: 'CURRENT_SONG_PAUSED' },
            ];

            const load = loadYoutubePlayer(api, 'container', true)(mockDispatch(expectedActions), getState);

            player.ready();

            return load
              .then(() => {
                player.play();
                return new Promise((resolve) => {
                  setTimeout(() => {
                    player.pause();
                    resolve();
                  }, 550);
                });
              }).then(() => expect(expectedActions.length).toEqual(0));
          });

          it('should dispatch playing action once', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
              { type: 'CURRENT_SONG_PLAYING' },
              { type: 'CURRENT_SONG_UPDATE' },
              { type: 'CURRENT_SONG_UPDATE' },
              { type: 'CURRENT_SONG_PAUSED' },
            ];

            const load = loadYoutubePlayer(api, 'container', true)(mockDispatch(expectedActions), getState);

            player.ready();

            return load
              .then(() => {
                player.play();
                state.currentSong.status = 'PLAYING';
                player.play();
                player.pause();
              }).then(() => expect(expectedActions.length).toEqual(0));
          });

          it('should dispatch paused action once', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
              { type: 'CURRENT_SONG_PAUSED' },
            ];

            const load = loadYoutubePlayer(api, 'container', true)(mockDispatch(expectedActions), getState);

            player.ready();

            return load
              .then(() => {
                player.pause();
                state.currentSong.status = 'PAUSED';
                player.pause();
              }).then(() => expect(expectedActions.length).toEqual(0));
          });

          it('should recreate player when container is different', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
            ];

            const load = loadYoutubePlayer(api, 'container', true)(mockDispatch(expectedActions), getState);

            player.ready();

            player = Object.assign({}, player);

            return load
              .then(() => {
                const secondLoad = loadYoutubePlayer(api, 'different-container')(mockDispatch(expectedActions), getState);
                player.ready();
                return secondLoad;
              })
              .then(p => expect(p).toBe(player))
              .then(() => expect(expectedActions.length).toEqual(0));
          });

          it('should not recreate player when shouldReset is false', () => {
            const expectedActions = [
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
              loadYoutubePlayerStart(),
              loadYoutubePlayerSucceeded(),
            ];

            const load = loadYoutubePlayer(api, 'container', true)(mockDispatch(expectedActions), getState);

            player.ready();

            const originalPlayer = player;
            player = Object.assign({}, player);

            return load
              .then(() => loadYoutubePlayer(api, 'container')(mockDispatch(expectedActions), getState))
              .then(p => expect(p).toBe(originalPlayer))
              .then(() => expect(expectedActions.length).toEqual(0));
          });
        });
      });
    });
  });
});
