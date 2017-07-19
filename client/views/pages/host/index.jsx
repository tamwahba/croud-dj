import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { changeRoom } from '../../../core/room';
import { addSong, downVoteSong, upVoteSong, SongListState } from '../../../core/song-lists';

import NowPlaying from '../../components/now-playing';
import SongList from '../../components/song-list';
import SongSelector from '../../components/song-selector';
import PlayerContainer from '../../components/player-container';

import './styles.less';

export class UnconnectedHostPage extends React.Component {
  constructor(props) {
    super();

    this.handleDownVote = this.handleDownVote.bind(this);
    this.handleReplay = this.handleReplay.bind(this);
    this.handleUpVote = this.handleUpVote.bind(this);

    props.dispatch(changeRoom(props.match.params.room));
  }

  componentWillReceiveProps(newProps) {
    const { dispatch, match } = newProps;

    if (this.props.match.params.room !== match.params.room) {
      dispatch(changeRoom(match.params.room));
    }
  }

  handleDownVote(id) {
    this.props.dispatch(downVoteSong(this.props.room.name, 'queue', id));
  }

  handleReplay(id) {
    const song = this.props.played.songs.get(id);
    this.props.dispatch(addSong(this.props.room.name, 'queue', song));
  }

  handleUpVote(id) {
    this.props.dispatch(upVoteSong(this.props.room.name, 'queue', id));
  }

  render() {
    const { isLoading, isValid } = this.props.room;
    if (!isLoading && !isValid) {
      return <div><h2>Room does not exist</h2></div>;
    }

    return (
      <div className="host">
        <NowPlaying showControls />
        <SongSelector />
        <PlayerContainer />
        <h4>queue</h4>
        <SongList
          showVotes
          className="list list--wide"
          songList={this.props.queue}
          onSongUpVote={this.handleUpVote}
          onSongDownVote={this.handleDownVote}
        />
        <h4>played</h4>
        <SongList
          showReplay
          className="list"
          songList={this.props.played}
          onSongReplay={this.handleReplay}
        />
      </div>
    );
  }
}

UnconnectedHostPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      room: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  played: PropTypes.instanceOf(SongListState).isRequired,
  queue: PropTypes.instanceOf(SongListState).isRequired,
  room: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

function mapStateToProps(state) {
  const room = state.room;
  return {
    room,
    played: state.songLists.get(`${room.name}-played`),
    queue: state.songLists.get(`${room.name}-queue`),
  };
}

export default connect(mapStateToProps)(UnconnectedHostPage);
