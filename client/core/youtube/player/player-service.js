let interval;
let player;

export function initializeYoutubePlayer(api, containerID, events, shouldReset) {
  const { onBuffering, onDurationUpdated, onError, onPaused, onPlaying, onTimeUpdated } = events;

  if (player && !shouldReset) {
    return Promise.resolve(player);
  }

  return new Promise((resolve, reject) => {
    player = new api.Player(containerID, {
      events: {
        onReady: () => {
          // console.log('ready', player);
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
