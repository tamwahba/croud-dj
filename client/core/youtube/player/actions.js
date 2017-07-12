import { currentSongBuffering,
  currentSongElapsed,
  currentSongError,
  currentSongPaused,
  currentSongPlaying,
  currentSongUpdate,
  CurrentSongStatuses } from '../../current-song';
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

export function loadYoutubePlayer(api, container, shouldReset = false) {
  return (dispatch, getState) => {
    dispatch(loadYoutubePlayerStart());

    return initializeYoutubePlayer(api, container, {
      onBuffering: () => dispatch(currentSongBuffering()),
      onDurationUpdated: duration => dispatch(currentSongUpdate({ duration })),
      onError: () => dispatch(currentSongError()),
      onPaused: () => {
        if (getState().currentSong.status !== CurrentSongStatuses.PAUSED) {
          dispatch(currentSongPaused());
        }
      },
      onPlaying: () => {
        if (getState().currentSong.status !== CurrentSongStatuses.PLAYING) {
          dispatch(currentSongPlaying());
        }
      },
      onTimeUpdated: time => dispatch(currentSongElapsed(time)),
    }, shouldReset).then((player) => {
      dispatch(loadYoutubePlayerSucceeded(player));
      return player;
    }).catch(error => dispatch(loadYoutubePlayerFailed(error)));
  };
}
