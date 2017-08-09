import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeRoom, RoomState } from '../../../core/room';
import { SongStatuses } from '../../../core/song';
import { addSong, downVoteSong, upVoteSong, SongListState } from '../../../core/song-lists';
import { UserState } from '../../../core/users';

import NowPlaying from '../../components/now-playing';
import SongList from '../../components/song-list';
import SearchResults from '../../components/search-results';
import SearchInput from '../../components/search-input';
import PlayerContainer from '../../components/player-container';

import './styles.less';

export class UnconnectedRoomPage extends React.Component {
  constructor(props) {
    const { match } = props;
    super();

    this.handleDownVote = this.handleDownVote.bind(this);
    this.handleReplay = this.handleReplay.bind(this);
    this.handleUpVote = this.handleUpVote.bind(this);

    props.changeRoom(match.params.id);
  }

  componentWillReceiveProps(newProps) {
    const { match } = newProps;

    if (this.props.match.params.id !== match.params.id) {
      this.props.changeRoom(match.params.id);
    }
  }

  handleDownVote(id) {
    this.props.downVoteSong(this.props.room.name, 'queue', id);
  }

  handleReplay(id) {
    const song = this.props.played.songs.get(id);
    this.props.addSong(this.props.room.name, 'queue', song.merge({ elapsed: 0, status: SongStatuses.UNSTARTED }).toJS());
  }

  handleUpVote(id) {
    this.props.upVoteSong(this.props.room.name, 'queue', id);
  }

  render() {
    const { isLoading, isValid, owner } = this.props.room;
    const exists = isLoading || (!isLoading && isValid);
    const isHostPage = this.props.match.params.type === 'host';
    const isOwner = owner === this.props.user.id;

    if (!exists) {
      return <div><h2>Room does not exist</h2></div>;
    } else if (isHostPage && !isOwner) {
      return <div><h2>Room owned by other user</h2></div>;
    }

    return (
      <div className="room">
        <NowPlaying showControls={isHostPage} />
        <SearchInput />
        <SearchResults />
        {isHostPage && <PlayerContainer />}
        <h4>queue</h4>
        <SongList
          showVotes
          className="room__list room__list--wide"
          songList={this.props.queue}
          onSongUpVote={this.handleUpVote}
          onSongDownVote={this.handleDownVote}
        />
        <h4>played</h4>
        <SongList
          showReplay
          className="room__list"
          songList={this.props.played}
          onSongReplay={this.handleReplay}
        />
      </div>
    );
  }
}

UnconnectedRoomPage.defaultProps = {
  played: new SongListState(),
  queue: new SongListState(),
  user: new UserState(),
};

UnconnectedRoomPage.propTypes = {
  addSong: PropTypes.func.isRequired,
  changeRoom: PropTypes.func.isRequired,
  downVoteSong: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  played: PropTypes.instanceOf(SongListState),
  queue: PropTypes.instanceOf(SongListState),
  room: PropTypes.instanceOf(RoomState).isRequired,
  user: PropTypes.instanceOf(UserState).isRequired,
  upVoteSong: PropTypes.func.isRequired,
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
  return bindActionCreators({ addSong, changeRoom, downVoteSong, upVoteSong }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedRoomPage);
