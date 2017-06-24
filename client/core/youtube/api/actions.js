import loadScript from 'load-script';

export const YOUTUBE_API_FETCH_START = 'YOUTUBE_API_FETCH_START';
export const YOUTUBE_API_FETCH_SUCCESS = 'YOUTUBE_API_FETCH_SUCCESS';
export const YOUTUBE_API_FETCH_FAILURE = 'YOUTUBE_API_FETCH_FAILURE';

export function fetchYoutubeAPIStart() {
  return {
    type: YOUTUBE_API_FETCH_START,
  };
}

export function fetchYoutubeAPISucceeded(api) {
  return {
    type: YOUTUBE_API_FETCH_SUCCESS,
    api,
  };
}

export function fetchYoutubeAPIFailed() {
  return {
    type: YOUTUBE_API_FETCH_FAILURE,
  };
}

export function loadYoutubeAPI() {
  /* eslint-env browser */
  return (dispatch) => {
    let loadAPI;
    dispatch(fetchYoutubeAPIStart());

    if (window.YT) {
      loadAPI = Promise.resolve(window.YT);
    } else {
      loadAPI = new Promise((resolve, reject) => {
        loadScript('https://www.youtube.com/iframe_api', (error) => {
          const prevCallback = window.onYouTubeIframeAPIReady;
          if (error) {
            reject(error);
            return;
          }

          window.onYouTubeIframeAPIReady = () => {
            if (prevCallback) {
              try {
                prevCallback();
              } catch (err) {
                reject(err);
                return;
              }
            }
            resolve(window.YT);
          };
        });
      });
    }

    return loadAPI
      .then((api) => {
        dispatch(fetchYoutubeAPISucceeded(api));
        return api;
      }).catch(() => dispatch(fetchYoutubeAPIFailed()));
  };
}
