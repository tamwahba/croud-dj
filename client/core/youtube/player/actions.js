
export const YOUTUBE_PLAYER_START = 'YOUTUBE_PLAYER_START';
export const YOUTUBE_PLAYER_READY = 'YOUTUBE_PLAYER_READY';
export const YOUTUBE_PLAYER_ERROR = 'YOUTUBE_PLAYER_ERROR';

export function loadYoutubePlayer() {
  return {
    type: YOUTUBE_PLAYER_START,
  };
}

export function loadYoutubePlayerSucceeded(player) {
  return {
    type: YOUTUBE_PLAYER_READY,
    player,
  };
}

export function loadYoutubePlayerFailed() {
  return {
    type: YOUTUBE_PLAYER_ERROR,
  };
}
