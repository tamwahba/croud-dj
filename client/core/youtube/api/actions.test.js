/* eslint-env mocha, browser */
import expect from 'expect';

import {
  YOUTUBE_API_FETCH_START,
  YOUTUBE_API_FETCH_SUCCESS,
  YOUTUBE_API_FETCH_FAILURE,
  fetchYoutubeAPIStart,
  fetchYoutubeAPISucceeded,
  fetchYoutubeAPIFailed,
  loadYoutubeAPI } from './actions';

describe('core', () => {
  describe('youtube', () => {
    describe('api', () => {
      describe('action producers', () => {
        describe('fetchYoutubeAPIStart', () => {
          it('should return correct action', () => {
            expect(fetchYoutubeAPIStart()).toEqual({
              type: YOUTUBE_API_FETCH_START,
            });
          });
        });

        describe('fetchYoutubeAPISucceeded', () => {
          it('should return correct action', () => {
            const api = null;

            expect(fetchYoutubeAPISucceeded(api)).toEqual({
              type: YOUTUBE_API_FETCH_SUCCESS,
              api,
            });
          });
        });

        describe('fetchYoutubeAPIFailed', () => {
          it('should return correct action', () => {
            expect(fetchYoutubeAPIFailed()).toEqual({
              type: YOUTUBE_API_FETCH_FAILURE,
            });
          });
        });

        describe('loadYoutubeAPI', () => {
          function mockDispatch(expectedActions) {
            return (action) => {
              const expectedAction = expectedActions.shift();
              expect(action.type).toEqual(expectedAction.type);
            };
          }

          afterEach(() => {
            const script = document
              .querySelector('script[src="https://www.youtube.com/iframe_api"]');
            if (script) {
              script.remove();
            }

            if (window.YT) {
              window.YT = undefined;
            }
          });

          it('should dispatch correct actions', () => {
            const expectedActions = [
              fetchYoutubeAPIStart(),
              fetchYoutubeAPISucceeded(),
            ];

            return loadYoutubeAPI()(mockDispatch(expectedActions))
              .then(() => expect(expectedActions.length).toEqual(0));
          });

          it('should not reload the api', () => {
            const expectedActions = [
              fetchYoutubeAPIStart(),
              fetchYoutubeAPISucceeded(),
            ];

            const windowObj = { o: 'o' };
            window.YT = windowObj;

            return loadYoutubeAPI()(mockDispatch(expectedActions))
              .then(api => expect(api).toEqual(windowObj))
              .then(() => expect(expectedActions.length).toEqual(0));
          });

          it('should dispatch failure action on error', () => {
            const expectedActions = [
              fetchYoutubeAPIStart(),
              fetchYoutubeAPIFailed(),
            ];

            window.onYouTubeIframeAPIReady = () => { throw new Error('Mock Error'); };

            return loadYoutubeAPI()(mockDispatch(expectedActions))
              .then(() => expect(expectedActions.length).toEqual(0));
          });
        });
      });
    });
  });
});
