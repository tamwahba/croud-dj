import { SongServices } from '../song';

export const SEARCH_CLEAR = 'SEARCH_CLEAR';
export const SEARCH_START = 'SEARCH_START';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';

export function searchClear() {
  return {
    type: SEARCH_CLEAR,
  };
}

export function searchStart(query) {
  return {
    type: SEARCH_START,
    query,
  };
}

export function searchSucceeded(results) {
  return {
    type: SEARCH_SUCCESS,
    results,
  };
}

export function searchFailed() {
  return {
    type: SEARCH_FAILURE,
  };
}

export function extractInfoYoutube(channelTitle, videoTitle) {
  let artist = channelTitle;
  let title = videoTitle;

  if (artist && /vevo/i.test(artist)) {
    const titleParts = title.split(' - ');
    artist = titleParts[1] ? titleParts[0] : artist;
    title = titleParts[1] || title;
  }

  const artistRegExp = new RegExp(`(${artist} - )|( - ${artist})`, 'i');
  if (artist && artistRegExp.test(title)) {
    title = title.replace(artistRegExp, '');
  }

  return { artist, title };
}

export function searchYouTube(query) {
  /* eslint-env browser */
  const key = 'AIzaSyBGM4jCuq_-ofK_qN-T-ftY7MyiiZlzTwg';
  const params = [
    `key=${key}`,
    'part=snippet',
    'type=video',
    `q=${encodeURIComponent(query)}`,
  ].join('&');
  return fetch(
    `https://www.googleapis.com/youtube/v3/search?${params}`,
    {
      method: 'GET',
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`Server resoponed with ${response.status}`);
    }).then(({ items }) => items.map((video) => {
      const snippet = video.snippet;
      const { artist, title } = extractInfoYoutube(snippet.channelTitle, snippet.title);

      return {
        artist,
        artwork: snippet.thumbnails.medium.url,
        id: video.id.videoId,
        service: SongServices.YOUTUBE,
        title,
      };
    }));
}

export function search(query, searchServices = [searchYouTube]) {
  return (dispatch) => {
    dispatch(searchStart(query));
    return Promise.all(searchServices.map(
      service => service(query).catch(error => ({ hasError: true, error }))))
        .then((promiseResults) => {
          const succeededResults = [];
          promiseResults.forEach((res) => {
            if (res.hasError) {
              // TODO: handle or log error.
            } else {
              succeededResults.push(res);
            }
          });

          const results = [].concat(...succeededResults);
          if (results.length === 0) {
            return dispatch(searchFailed());
          }
          return dispatch(searchSucceeded(results));
        });
  };
}
