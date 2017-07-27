/* eslint-env mocha */
import expect from 'expect';

import { initializeYoutubePlayer } from './player-service';

describe('core', () => {
  describe('youtube', () => {
    describe('player', () => {
      describe('service', () => {
        const eventSpies = {
          onBuffering: expect.createSpy(),
          onDurationUpdated: expect.createSpy(),
          onError: expect.createSpy(),
          onPaused: expect.createSpy(),
          onPlaying: expect.createSpy(),
          onTimeUpdated: expect.createSpy(),
        };
        let player;

        function MockPlayer(container, { events }) {
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

        beforeEach(() => {
          eventSpies.onBuffering.reset();
          eventSpies.onDurationUpdated.reset();
          eventSpies.onError.reset();
          eventSpies.onPaused.reset();
          eventSpies.onPlaying.reset();
          eventSpies.onTimeUpdated.reset();
        });

        afterEach(() => {
          player = undefined;
        });

        it('should resolve when player is ready', () => {
          const load = initializeYoutubePlayer(api, '#container', eventSpies, true);

          player.ready();

          return load;
        });

        it('should fail when player has error', (done) => {
          const load = initializeYoutubePlayer(api, '#container', eventSpies, true);

          player.error();

          load.catch(done);
        });

        it('should re-instantiate player if shouldReset is false', () => {
          initializeYoutubePlayer(api, '#container', eventSpies, true);

          const initialPlayer = player;
          player.ready();

          const load = initializeYoutubePlayer(api, '#container', eventSpies, true);

          player.ready();

          return load.then(p => expect(p).toNotBe(initialPlayer));
        });

        it('should not re-instantiate player if shouldReset is false', () => {
          initializeYoutubePlayer(api, '#container', eventSpies, true);

          const initialPlayer = player;
          player.ready();

          const load = initializeYoutubePlayer(api, '#container', eventSpies, false);

          return load.then(p => expect(p).toBe(initialPlayer));
        });

        it('should call onBuffering when player is buffering', () => {
          const load = initializeYoutubePlayer(api, '#container', eventSpies, true);

          player.ready();
          player.buffer();

          return load.then(() => expect(eventSpies.onBuffering).toHaveBeenCalled());
        });

        it('should call onDurationUpdated when player is playing', () => {
          const load = initializeYoutubePlayer(api, '#container', eventSpies, true);

          player.ready();
          player.play();
          player.pause();

          return load.then(() => expect(eventSpies.onDurationUpdated).toHaveBeenCalled());
        });

        it('should call onError when player has error', () => {
          const load = initializeYoutubePlayer(api, '#container', eventSpies, true);

          player.ready();
          player.error();

          return load.then(() => expect(eventSpies.onError).toHaveBeenCalled());
        });

        it('should call onPaused when player is paused', () => {
          const load = initializeYoutubePlayer(api, '#container', eventSpies, true);

          player.ready();
          player.pause();

          return load.then(() => expect(eventSpies.onPaused).toHaveBeenCalled());
        });

        it('should call onPlaying when player is playing', () => {
          const load = initializeYoutubePlayer(api, '#container', eventSpies, true);

          player.ready();
          player.play();

          return load.then(() => expect(eventSpies.onPlaying).toHaveBeenCalled());
        });

        it('should call onTimeUpdated when player is playing', () => {
          const load = initializeYoutubePlayer(api, '#container', eventSpies, true);

          player.ready();
          player.play();

          return load
            .then(() => (new Promise((resolve) => {
              setTimeout(() => {
                player.pause();
                resolve();
              }, 550);
            })))
            .then(() => expect(eventSpies.onTimeUpdated).toHaveBeenCalled());
        });

        it('should not call anything otherwise', () => {
          const load = initializeYoutubePlayer(api, '#container', eventSpies, true);

          player.ready();
          player.unknown();

          return load.then(() => {
            expect(eventSpies.onBuffering).toNotHaveBeenCalled();
            expect(eventSpies.onDurationUpdated).toNotHaveBeenCalled();
            expect(eventSpies.onError).toNotHaveBeenCalled();
            expect(eventSpies.onPaused).toNotHaveBeenCalled();
            expect(eventSpies.onPlaying).toNotHaveBeenCalled();
            expect(eventSpies.onTimeUpdated).toNotHaveBeenCalled();
          });
        });
      });
    });
  });
});
