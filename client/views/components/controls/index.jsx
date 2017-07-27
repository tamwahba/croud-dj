import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { pauseCurrentSong,
  playCurrentSong,
  changeCurrentSong } from '../../../core/current-song';
import { SongStatuses } from '../../../core/song';
import { addSong, removeSong, SongListState } from '../../../core/song-lists';

import Button from '../button';

import './styles.less';

export function UnconnectedControls(props) {
  const { className, nextKey, onClickNext } = props;
  let statusButton;

  switch (props.status) {
    case SongStatuses.BUFFERING:
      statusButton = <Button className="controls__button controls__button--status">Loading</Button>;
      break;
    case SongStatuses.ERROR:
      statusButton = <Button className="controls__button controls__button--status">Error</Button>;
      break;
    case SongStatuses.PAUSED:
      statusButton = (
        <Button
          className="controls__button"
          onClick={props.onClickPlay}
        >Play</Button>);
      break;
    case SongStatuses.PLAYING:
      statusButton = (
        <Button
          className="controls__button"
          onClick={props.onClickPause}
        >Pause</Button>);
      break;
    default:
      break;
  }

  return (
    <div className={`controls ${className}`}>
      {statusButton}
      {nextKey && <Button className="controls__button" onClick={onClickNext}>Next</Button>}
    </div>
  );
}

UnconnectedControls.defaultProps = {
  className: '',
  nextKey: '',
};

UnconnectedControls.propTypes = {
  className: PropTypes.string,
  nextKey: PropTypes.string,
  onClickNext: PropTypes.func.isRequired,
  onClickPause: PropTypes.func.isRequired,
  onClickPlay: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    room: state.room,
    song: state.currentSong,
    queue: state.songLists.get(`${state.room.name}-queue`),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addSong: (room, listKey, song) => dispatch(addSong(room, listKey, song)),
    onClickPause: () => dispatch(pauseCurrentSong()),
    onClickPlay: () => dispatch(playCurrentSong()),
    play: song => dispatch(changeCurrentSong(song.toJS())),
    removeSong: (room, listKey, songKey) => dispatch(removeSong(room, listKey, songKey)),
  };
}

export function mergeProps(stateProps, dispatchProps) {
  const { room, song, queue = new SongListState() } = stateProps;
  const nextKey = queue.order.first();
  return {
    nextKey,
    onClickNext: () => {
      const empty = song.status === SongStatuses.EMPTY;
      if (!empty) {
        dispatchProps.addSong(room.name, 'played', song.merge({ elapsed: 0, status: SongStatuses.EMPTY }).toJS());
      }
      dispatchProps.play(queue.songs.get(nextKey));
      dispatchProps.removeSong(room.name, 'queue', nextKey);
    },
    onClickPause: dispatchProps.onClickPause,
    onClickPlay: dispatchProps.onClickPlay,
    status: song.status,
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(UnconnectedControls);
