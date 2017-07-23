import { updateCurrentSong,
  updateCurrentSongElapsed,
  updateCurrentSongStatus } from '../../current-song';
import { SongStatuses } from '../../song';

import { initializeYoutubePlayer } from './player-service';

export const YOUTUBE_PLAYER_START = 'YOUTUBE_PLAYER_START';
export const YOUTUBE_PLAYER_READY = 'YOUTUBE_PLAYER_READY';
export const YOUTUBE_PLAYER_ERROR = 'YOUTUBE_PLAYER_ERROR';

export function loadYoutubePlayerStart() {
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

export function loadYoutubePlayer(api, container, shouldReset = false, actions = {
  updateElapsed: updateCurrentSongElapsed,
  updateSong: updateCurrentSong,
  updateStatus: updateCurrentSongStatus,
}, initializePlayer = initializeYoutubePlayer) {
  return (dispatch) => {
    dispatch(loadYoutubePlayerStart());

    return initializePlayer(api, container, {
      onBuffering: () => dispatch(actions.updateStatus(SongStatuses.BUFFERING)),
      onDurationUpdated: duration => dispatch(actions.updateSong({ duration })),
      onError: () => dispatch(actions.updateStatus(SongStatuses.ERROR)),
      onPaused: () => dispatch(actions.updateStatus(SongStatuses.PAUSED)),
      onPlaying: () => dispatch(actions.updateStatus(SongStatuses.PLAYING)),
      onTimeUpdated: time => dispatch(actions.updateElapsed(time)),
    }, shouldReset).then((player) => {
      dispatch(loadYoutubePlayerSucceeded(player));
      return player;
    }).catch(error => dispatch(loadYoutubePlayerFailed(error)));
  };
}
