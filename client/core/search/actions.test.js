/* eslint-env mocha */
import expect from 'expect';

import { SongServices } from '../song';
import { mockDispatch, MockPromise } from '../test-utils';

import { SEARCH_CLEAR,
  SEARCH_START,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  searchClear,
  searchStart,
  searchSucceeded,
  searchFailed,
  extractInfoYoutube,
  searchYouTube,
  search } from './actions';

describe('core', () => {
  describe('search', () => {
    describe('actions', () => {
      describe('searchClear', () => {
        it('should return correct action', () => {
          expect(searchClear()).toEqual({
            type: SEARCH_CLEAR,
          });
        });
      });

      describe('searchStart', () => {
        it('should return correct action', () => {
          const query = 'q';
          expect(searchStart(query)).toEqual({
            type: SEARCH_START,
            query,
          });
        });
      });

      describe('searchSucceeded', () => {
        it('should return correct action', () => {
          const results = {};
          expect(searchSucceeded(results)).toEqual({
            type: SEARCH_SUCCESS,
            results,
          });
        });
      });

      describe('searchFailed', () => {
        it('should return correct action', () => {
          expect(searchFailed()).toEqual({
            type: SEARCH_FAILURE,
          });
        });
      });

      describe('extractInfoYoutube', () => {
        it('should split on hyphen if vevo channel', () => {
          const artist = 'artist';
          const channel = 'ytVEVO';
          const title = 'title';
          const video = `${artist} - ${title}`;

          expect(extractInfoYoutube(channel, video)).toEqual({ artist, title });
        });

        it('should ignore if vevo channel and no hyphen', () => {
          const artist = 'artist';
          const channel = 'ytVEVO';
          const title = 'title';
          const video = `${artist}${title}`;

          expect(extractInfoYoutube(channel, video)).toEqual({ artist: channel, title: video });
        });


        it('should remove channel name and hyphen from title', () => {
          const channel = 'yt';
          const title = 'title';
          const video = `${channel} - ${title}`;

          expect(extractInfoYoutube(channel, video)).toEqual({ artist: channel, title });
        });
      });

      describe('searchYouTube', () => {
        /* eslint-env browser */
        const mockFetch = new MockPromise();
        const mockItems = [
          {
            kind: 'youtube#video',
            etag: 'etag',
            id: 'id',
            snippet: {
              publishedAt: 'publishedAt',
              channelId: 'channelId',
              title: 'title',
              description: 'description',
              thumbnails: {
                default: {
                  url: 'default.url',
                  width: 10,
                  height: 10,
                },
                medium: {
                  url: 'medium.url',
                  width: 10,
                  height: 10,
                },
                high: {
                  url: 'high.url',
                  width: 10,
                  height: 10,
                },
                standard: {
                  url: 'standard.url',
                  width: 10,
                  height: 10,
                },
              },
              channelTitle: 'channelTitle',
              tags: ['tag1'],
              caregoryId: 'caregoryId',
              defaultLanguage: 'defaultLanguage',
              localized: {
                title: 'localized.title',
                description: 'localized.description',
              },
              defaultAudioLanguage: 'defaultAudioLanguage',
            },
          },
        ];

        before(() => {
          expect.spyOn(window, 'fetch').andCall(() => mockFetch.promise);
        });

        beforeEach(() => {
          window.fetch.reset();
          mockFetch.reset();
        });

        after(() => {
          window.fetch.restore();
        });

        it('should return a promise', () => {
          expect(searchYouTube()).toBeA(Promise);
        });

        it('should reject when response is not ok', (done) => {
          const searchYT = searchYouTube();

          mockFetch.resolveWith({ ok: false });

          searchYT.catch(() => { done(); });
        });

        it('should resolve with an array of songs', () => {
          const searchYT = searchYouTube();

          mockFetch.resolveWith({ ok: true, json: () => ({ items: mockItems }) });

          return searchYT.then((results) => {
            expect(results).toBeAn(Array);
            expect(results[0]).toIncludeKeys(['artist', 'artwork', 'id', 'service', 'title']);
          });
        });

        it('should add service of type YOUTUBE to each song', () => {
          const searchYT = searchYouTube();

          mockFetch.resolveWith({ ok: true, json: () => ({ items: mockItems }) });

          return searchYT.then((results) => {
            results.forEach((result) => {
              expect(result.service).toEqual(SongServices.YOUTUBE);
            });
          });
        });
      });

      describe('search', () => {
        it('should dispatch correct actions on success', () => {
          const expectedActions = [
            searchStart(),
            searchSucceeded(),
          ];

          return search('', [() => Promise.resolve([{}])])(mockDispatch(expectedActions))
            .then(() => expect(expectedActions.length).toEqual(0));
        });

        it('should dispatch correct actions on failure', () => {
          const expectedActions = [
            searchStart(),
            searchFailed(),
          ];

          return search('', [() => Promise.reject()])(mockDispatch(expectedActions))
            .then(() => expect(expectedActions.length).toEqual(0));
        });
      });
    });
  });
});
