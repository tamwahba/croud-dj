export const CURRENT_SONG_BUFFERING = 'CURRENT_SONG_BUFFERING';
export const CURRENT_SONG_ELAPSED = 'CURRENT_SONG_ELAPSED';
export const CURRENT_SONG_ERROR = 'CURRENT_SONG_ERROR';
export const CURRENT_SONG_PAUSED = 'CURRENT_SONG_PAUSED';
export const CURRENT_SONG_PLAYING = 'CURRENT_SONG_PLAYING';
export const CURRENT_SONG_UPDATE = 'CURRENT_SONG_UPDATE';

export function currentSongBuffering() {
  return {
    type: CURRENT_SONG_BUFFERING,
  };
}

export function currentSongElapsed(time) {
  return {
    type: CURRENT_SONG_ELAPSED,
    elapsed: time,
  };
}

export function currentSongError() {
  return {
    type: CURRENT_SONG_ERROR,
  };
}

export function currentSongPaused() {
  return {
    type: CURRENT_SONG_PAUSED,
  };
}

export function currentSongPlaying() {
  return {
    type: CURRENT_SONG_PLAYING,
  };
}

export function currentSongUpdate(song) {
  return {
    type: CURRENT_SONG_UPDATE,
    song,
  };
}
