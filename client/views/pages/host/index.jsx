import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { changeRoom } from '../../../core/room';
import { SongStatuses } from '../../../core/song';
import { addSong, downVoteSong, upVoteSong, SongListState } from '../../../core/song-lists';
import { UserState } from '../../../core/users';

import NowPlaying from '../../components/now-playing';
import SongList from '../../components/song-list';
import SearchResults from '../../components/search-results';
import SearchInput from '../../components/search-input';
import PlayerContainer from '../../components/player-container';

import './styles.less';

export class UnconnectedHostPage extends React.Component {
  constructor(props) {
    const { match } = props;
    super();

    this.handleDownVote = this.handleDownVote.bind(this);
    this.handleReplay = this.handleReplay.bind(this);
    this.handleUpVote = this.handleUpVote.bind(this);

    props.changeRoom(match.params.room);
  }

  componentWillReceiveProps(newProps) {
    const { match } = newProps;

    if (this.props.match.params.room !== match.params.room) {
      this.props.changeRoom(match.params.room);
    }
  }

  handleDownVote(id) {
    this.props.dispatch(downVoteSong(this.props.room.name, 'queue', id));
  }

  handleReplay(id) {
    const song = this.props.played.songs.get(id);
    this.props.dispatch(addSong(this.props.room.name, 'queue', song.merge({ elapsed: 0, status: SongStatuses.UNSTARTED }).toJS()));
  }

  handleUpVote(id) {
    this.props.dispatch(upVoteSong(this.props.room.name, 'queue', id));
  }

  render() {
    const { isLoading, isValid, owner } = this.props.room;
    if (!isLoading && !isValid) {
      return <div><h2>Room does not exist</h2></div>;
    }

    if (!isLoading && isValid && owner !== this.props.user.id) {
      return <div><h2>Room owned by other user</h2></div>;
    }

    return (
      <div className="host">
        <NowPlaying showControls />
        <SearchInput />
        <SearchResults />
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

UnconnectedHostPage.defaultProps = {
  played: new SongListState(),
  queue: new SongListState(),
};

UnconnectedHostPage.propTypes = {
  changeRoom: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      room: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  played: PropTypes.instanceOf(SongListState),
  queue: PropTypes.instanceOf(SongListState),
  room: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
  }).isRequired,
  user: PropTypes.instanceOf(UserState).isRequired,
};

function mapStateToProps(state) {
  const room = state.room;
  return {
    played: state.songLists.get(`${room.name}-played`),
    queue: state.songLists.get(`${room.name}-queue`),
    room,
    user: state.users.get(state.currentUser.id) || new UserState(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeRoom: name => dispatch(changeRoom(name)),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedHostPage);
