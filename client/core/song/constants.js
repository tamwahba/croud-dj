import { Record } from 'immutable';

export const SongServices = Object.freeze({
  EMPTY: 'EMPTY',
  YOUTUBE: 'YOUTUBE',
});

export const SongStatuses = Object.freeze({
  BUFFERING: 'BUFFERING',
  EMPTY: 'EMPTY',
  ERROR: 'ERROR',
  PAUSED: 'PAUSED',
  PLAYING: 'PLAYING',
  UNSTARTED: 'UNSTARTED',
});

export const SongState = new Record({
  addedBy: '',
  artist: '',
  artwork: '',
  duration: 0,
  elapsed: 0,
  id: '',
  title: '',
  service: SongServices.EMPTY,
  skips: 0,
  status: SongStatuses.EMPTY,
  votes: 0,
});
