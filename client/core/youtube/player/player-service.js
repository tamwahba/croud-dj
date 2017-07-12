let container;
let interval;
let player;

export function initializeYoutubePlayer(api, newContainer, events, shouldReset) {
  const { onBuffering, onDurationUpdated, onError, onPaused, onPlaying, onTimeUpdated } = events;

  if (player && container === newContainer && !shouldReset) {
    return Promise.resolve(player);
  }

  return new Promise((resolve, reject) => {
    clearInterval(interval);

    player = new api.Player(newContainer, {
      events: {
        onReady: () => {
          container = newContainer;
          resolve(player);
        },
        onError: (error) => {
          onError();
          reject(error);
        },
        onStateChange: (event) => {
          clearInterval(interval);

          switch (event.data) {
            case 0: // ended
            case 2: // paused
              onPaused();
              break;
            case 1: // playing
              onPlaying();
              onDurationUpdated(player.getDuration());
              interval = setInterval(() => onTimeUpdated(player.getCurrentTime()), 500);
              break;
            case 3: // buffering
              onBuffering();
              break;
            case -1: // unstarted
            case 4: // queued
            default:
              break;
          }
        },
      },
    });
  });
}
