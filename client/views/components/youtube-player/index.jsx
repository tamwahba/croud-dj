import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { CurrentSongStatuses } from '../../../core/current-song';
import { loadYoutubeAPI } from '../../../core/youtube/api';
import { loadYoutubePlayer } from '../../../core/youtube/player';

import './styles.less';

export class YoutubePlayer extends React.Component {
  componentDidMount() {
    const { dispatch, songID, songPosition } = this.props;
    dispatch(loadYoutubeAPI())
      .then((api) => {
        dispatch(loadYoutubePlayer(api, this.iframe))
          .then((player) => {
            if (songID) {
              player.loadVideoById(songID, songPosition);
            }
          });
      });
  }

  componentWillReceiveProps(nextProps) {
    const { player } = this.props;

    if (this.props.status !== nextProps.status) {
      switch (nextProps.status) {
        case CurrentSongStatuses.PAUSED:
          player.pauseVideo();
          break;
        case CurrentSongStatuses.PLAYING:
          player.playVideo();
          break;
        default:
          break;
      }
    }

    if (player && this.props.songID !== nextProps.songID) {
      player.loadVideoById(nextProps.songID);
    }
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
  player: PropTypes.shape({
    loadVideoById: PropTypes.func.isRequired,
    pauseVideo: PropTypes.func.isRequired,
    playVideo: PropTypes.func.isRequired,
  }),
  songID: PropTypes.string.isRequired,
  songPosition: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    player: state.youtube.player.player,
    songID: state.currentSong.id,
    songPosition: state.currentSong.elapsed,
    status: state.currentSong.status,
  };
}

export default connect(mapStateToProps)(YoutubePlayer);
