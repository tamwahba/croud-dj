import { Record } from 'immutable';

export const SongServices = Object.freeze({
  YOUTUBE: 'YOUTUBE',
});

export const SongStatuses = Object.freeze({
  BUFFERING: 'BUFFERING',
  EMPTY: 'EMPTY',
  ERROR: 'ERROR',
  PAUSED: 'PAUSED',
  PLAYING: 'PLAYING',
});

export const SongState = new Record({
  addedBy: '',
  artist: '',
  artwork: '',
  duration: 0,
  elapsed: 0,
  id: '',
  title: '',
  service: SongServices.YOUTUBE,
  skips: 0,
  status: SongStatuses.EMPTY,
  votes: 0,
});
