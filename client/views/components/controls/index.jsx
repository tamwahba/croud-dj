import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { currentSongPaused,
  currentSongPlaying,
  currentSongUpdate,
  CurrentSongStatuses } from '../../../core/current-song';

import './styles.less';

export function Controls(props) {
  let statusButton;

  switch (props.status) {
    case CurrentSongStatuses.BUFFERING:
      statusButton = <button className="controls__button controls__button--status">Loading</button>;
      break;
    case CurrentSongStatuses.ERROR:
      statusButton = <button className="controls__button controls__button--status">Error</button>;
      break;
    case CurrentSongStatuses.PAUSED:
      statusButton = (
        <button
          className="controls__button"
          onClick={props.onClickPlay}
        >Play</button>);
      break;
    case CurrentSongStatuses.PLAYING:
      statusButton = (
        <button
          className="controls__button"
          onClick={props.onClickPause}
        >Pause</button>);
      break;
    default:
      break;
  }

  return (
    <div className={`controls ${props.className}`}>
      {statusButton}
      <button className="controls__button" onClick={props.onClickNext}>Next</button>
    </div>
  );
}

Controls.defaultProps = {
  className: '',
};

Controls.propTypes = {
  className: PropTypes.string,
  onClickNext: PropTypes.func.isRequired,
  onClickPause: PropTypes.func.isRequired,
  onClickPlay: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    status: state.currentSong.status,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClickNext: () => dispatch(currentSongUpdate({ id: 'CAMWdvo71ls' })),
    onClickPause: () => dispatch(currentSongPaused()),
    onClickPlay: () => dispatch(currentSongPlaying()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
