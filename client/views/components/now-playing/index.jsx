import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Controls from '../controls';
import FormattedTime from '../formatted-time';
import Icon from '../icon';
import ProgressBar from '../progress-bar';

import logo from '../../icons/logo-text.svg';

import './styles.less';

export function NowPlaying({ currentSong, showControls }) {
  const { artist, duration, elapsed, title } = currentSong;
  const percentDone = (elapsed / duration) * 100;
  return (
    <div className="now-playing">
      <Icon alt="croud.dj logo" className="now-playing__logo" data={logo} />
      <div className="now-playing__heading">
        {artist && `${artist} - `}{title}
      </div>
      <div className="now-playing__info">
        {showControls && <Controls className="now-playing__info__controls" />}
        <span className="now-playing__info__duration">
          <FormattedTime time={elapsed} /> / <FormattedTime time={duration} />
        </span>
        <ProgressBar className="now-playing__info__progress-bar" percentComplete={percentDone} />
      </div>
    </div>
  );
}

NowPlaying.propTypes = {
  currentSong: PropTypes.shape({
    artist: PropTypes.string.isRequired,
    elapsed: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  showControls: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    currentSong: state.currentSong,
  };
}

export default connect(mapStateToProps)(NowPlaying);
