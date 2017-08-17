import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { changeCurrentSong } from '../../../core/current-song';
import { SongServices, SongState, SongStatuses } from '../../../core/song';
import { addSong, removeSong, SongListState } from '../../../core/song-lists';

import YoutubePlayer from '../youtube-player';

import './styles.less';

export class UnconnectedPlayerContainer extends React.Component {
  componentWillReceiveProps(nexProps) {
    const { song, queue } = nexProps;
    const duration = song.duration;
    const elapsed = song.elapsed;
    const empty = song.status === SongStatuses.EMPTY;

    const proportionRemaining = (duration - elapsed) / duration;
    const ending = proportionRemaining <= 0.01;

    if (!empty && ending) {
      this.props.addSongToPlayed(song);
    }

    if ((empty || ending) && !queue.order.isEmpty()) {
      const key = queue.order.first();
      this.props.play(queue.songs.get(key));
      this.props.removeFromQueue(key);
    } else if (ending) {
      this.props.play(new SongState());
    }
  }

  render() {
    const { song } = this.props;

    return (
      <div className="player-container player-container--youtube">
        <div className="player-container__content player-container__content--youtube">
          {song.service === SongServices.YOUTUBE && <YoutubePlayer />}
        </div>
      </div>
    );
  }
}

UnconnectedPlayerContainer.defaultProps = {
  queue: new SongListState(),
};

UnconnectedPlayerContainer.propTypes = {
  addSongToPlayed: PropTypes.func.isRequired,
  play: PropTypes.func.isRequired,
  removeFromQueue: PropTypes.func.isRequired,
  song: PropTypes.instanceOf(SongState).isRequired,
  queue: PropTypes.instanceOf(SongListState),
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
    play: song => dispatch(changeCurrentSong(song.toJS())),
    removeSong: (room, listKey, songKey) => dispatch(removeSong(room, listKey, songKey)),
  };
}

export function mergeProps(stateProps, dispatchProps) {
  return {
    addSongToPlayed: song => dispatchProps.addSong(
      stateProps.room.name, 'played', song.merge({ elapsed: 0, status: SongStatuses.EMPTY }).toJS()),
    play: dispatchProps.play,
    removeFromQueue: key => dispatchProps.removeSong(stateProps.room.name, 'queue', key),
    song: stateProps.song,
    queue: stateProps.queue,
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(UnconnectedPlayerContainer);
