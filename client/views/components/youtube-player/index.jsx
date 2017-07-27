import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { SongStatuses } from '../../../core/song';
import { loadYoutubeAPI } from '../../../core/youtube/api';
import { loadYoutubePlayer } from '../../../core/youtube/player';

import './styles.less';

export class YoutubePlayer extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    const { dispatch, songID, songPosition } = this.props;

    let loadYoutube = this.state.loadYoutube;

    if (!loadYoutube) {
      loadYoutube = dispatch(loadYoutubeAPI())
        .then(api => dispatch(loadYoutubePlayer(api, this.iframe)));

      this.setState({ loadYoutube });
    }

    loadYoutube.then((player) => {
      if (songID) {
        player.loadVideoById(songID, songPosition);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { songID, status } = this.props;

    this.state.loadYoutube.then((player) => {
      if (songID !== nextProps.songID && nextProps.status !== SongStatuses.EMPTY) {
        player.loadVideoById(nextProps.songID, nextProps.songPosition);
      } else if (status !== nextProps.status) {
        switch (nextProps.status) {
          case SongStatuses.PAUSED:
            player.pauseVideo();
            break;
          case SongStatuses.PLAYING:
            player.playVideo();
            break;
          default:
            break;
        }
      }
    });
  }

  render() {
    return (
      <iframe
        ref={(iframe) => { this.iframe = iframe; }}
        id="youtube-player"
        title="Youtube Player"
        className="youtube-player"
        src="https://www.youtube.com/embed/?enablejsapi=1&controls=0&autoplay=0"
      />
    );
  }
}

YoutubePlayer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  songID: PropTypes.string.isRequired,
  songPosition: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    songID: state.currentSong.id,
    songPosition: state.currentSong.elapsed,
    status: state.currentSong.status,
  };
}

export default connect(mapStateToProps)(YoutubePlayer);
