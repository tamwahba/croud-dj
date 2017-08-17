import PropTypes from 'prop-types';
import React from 'react';
import BEMhelper from 'react-bem-helper';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { changeRoom, checkRoomExists, createRoom, RoomState } from '../../../core/room';
import { SongStatuses } from '../../../core/song';
import { addSong, downVoteSong, upVoteSong, SongListState } from '../../../core/song-lists';
import { UserState } from '../../../core/users';

import NowPlaying from '../../components/now-playing';
import SongList from '../../components/song-list';
import SearchResults from '../../components/search-results';
import SearchInput from '../../components/search-input';
import TextInput from '../../components/text-input';
import PlayerContainer from '../../components/player-container';

import './styles.less';

const panelBlock = new BEMhelper({
  name: 'panel',
  outputIsString: true,
});
const roomBlock = new BEMhelper({
  name: 'room',
  outputIsString: true,
});

export class UnconnectedRoomPage extends React.Component {
  constructor(props) {
    const { match } = props;
    super();

    this.guestRoom = this.guestRoom.bind(this);
    this.handleDownVote = this.handleDownVote.bind(this);
    this.handleReplay = this.handleReplay.bind(this);
    this.handleUpVote = this.handleUpVote.bind(this);
    this.hostNewRoom = this.hostNewRoom.bind(this);
    this.hostRoom = this.hostRoom.bind(this);
    this.validateNewRoom = this.validateNewRoom.bind(this);
    this.validateRoom = this.validateRoom.bind(this);

    props.changeRoom(match.params.id);
  }

  componentWillReceiveProps(newProps) {
    const { match } = newProps;

    if (this.props.match.params.id !== match.params.id) {
      this.props.changeRoom(match.params.id);
    }
  }

  guestRoom(value, isValid) {
    const { history } = this.props;
    if (isValid) {
      history.push(`/guest/${value}`);
    }
  }

  handleDownVote(id) {
    const userID = this.props.user.id;
    this.props.downVoteSong(
      this.props.room.name,
      'queue',
      id,
      userID,
      this.props.queue.songs.get(id).votes.get(userID));
  }

  handleReplay(id) {
    const song = this.props.played.songs.get(id);
    this.props.addSong(
      this.props.room.name,
      'queue',
      song.merge({ elapsed: 0, status: SongStatuses.UNSTARTED }).toJS());
  }

  handleUpVote(id) {
    const userID = this.props.user.id;
    this.props.upVoteSong(
      this.props.room.name,
      'queue',
      id,
      userID,
      this.props.queue.songs.get(id).votes.get(userID));
  }

  hostNewRoom(value, isValid) {
    const { history, user } = this.props;
    if (isValid) {
      this.props.createRoom(value, user.id)
        .then(() => history.push(`/host/${value}`));
    }
  }

  hostRoom(value, isValid) {
    const { history } = this.props;
    if (isValid) {
      history.push(`/host/${value}`);
    }
  }

  validateNewRoom(value) {
    return this.props.checkRoomExists(value)
      .then(exists => ({ errorText: 'Already exists', isValid: !exists }));
  }

  validateRoom(value) {
    return this.props.checkRoomExists(value)
      .then(exists => ({ errorText: 'Does not exist', isValid: exists }));
  }

  render() {
    const { room, user } = this.props;
    const { isLoading, isValid, owner } = room;
    const exists = isLoading || (!isLoading && isValid);
    const isHostPage = this.props.match.params.type === 'host';
    const isOwner = owner === this.props.user.id;
    const modifiers = {
      host: isHostPage,
      overlaid: !exists || (isHostPage && !isOwner),
    };
    const roomID = this.props.match.params.id;

    let overlay;

    if (!exists) {
      overlay = (
        <div className={roomBlock('overlay', modifiers)}>
          <h3>This room does not exist!</h3>
          <h4>You can host a new room:</h4>
          <TextInput
            label="Room Name"
            value={roomID}
            onCommit={this.hostNewRoom}
            validate={this.validateNewRoom}
          />
          <h4>Join a different room:</h4>
          <TextInput
            label="Room Name"
            onCommit={this.guestRoom}
            validate={this.validateRoom}
          />
        </div>
      );
    } else if (isHostPage && !isOwner) {
      overlay = (
        <div className={roomBlock('overlay', modifiers)}>
          <h3>This room is owned by someone else!</h3>
          <h4>
            Did you mean to <Link to={`/guest/${roomID}`}>join {roomID} as a guest</Link> ?
          </h4>
          <span>or</span>
          <h4>Host a different room:</h4>
          <TextInput
            label="Room Name"
            onCommit={this.hostRoom}
            validate={this.validateNewRoom}
          />
        </div>
      );
    }

    const playedModifiers = Object.assign({}, modifiers, {
      played: true,
    });
    const played = (
      <div className={panelBlock({ extra: roomBlock('panel', playedModifiers) })}>
        <h3 className={panelBlock('title')}>Already Played</h3>
        <div className={panelBlock('content')}>
          <SongList
            showReplay
            className={roomBlock('list', playedModifiers)}
            songList={this.props.played}
            onSongReplay={this.handleReplay}
            userID={user.id}
          />
        </div>
      </div>
    );

    const queueModifiers = Object.assign({}, modifiers, {
      queue: true,
      wide: true,
    });
    const queue = (
      <div className={panelBlock({ extra: roomBlock('panel', queueModifiers) })}>
        <h3 className={panelBlock('title')}>Up Next</h3>
        <div className={panelBlock('content')}>
          <SongList
            showVotes
            className={roomBlock('list', queueModifiers)}
            songList={this.props.queue}
            onSongUpVote={this.handleUpVote}
            onSongDownVote={this.handleDownVote}
            userID={user.id}
          />
        </div>
      </div>
    );

    const searchModifiers = Object.assign({}, modifiers, {
      search: true,
    });
    const search = (
      <div className={panelBlock({ extra: roomBlock('panel', searchModifiers) })}>
        <div className={panelBlock('title')}>
          <SearchInput />
        </div>
        <div className={panelBlock('content')}>
          <SearchResults />
        </div>
      </div>
    );

    return (
      <div className={roomBlock({ modifiers })}>
        {overlay}
        <div className={roomBlock('content', modifiers)}>
          <NowPlaying showControls={isHostPage} />
          {isHostPage && !overlay &&
            <div className={panelBlock({ extra: roomBlock('panel', Object.assign({}, modifiers, { player: true })) })}>
              <div className={panelBlock('content')}>
                <PlayerContainer />
              </div>
            </div>
          }
          {search}
          {queue}
          {played}
        </div>
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
  checkRoomExists: PropTypes.func.isRequired,
  createRoom: PropTypes.func.isRequired,
  downVoteSong: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
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
  return bindActionCreators({
    addSong,
    changeRoom,
    checkRoomExists,
    createRoom,
    downVoteSong,
    upVoteSong,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedRoomPage);
