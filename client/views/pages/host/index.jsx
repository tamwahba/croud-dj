import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { changeRoom, roomChanged } from '../../../core/room';

import NowPlaying from '../../components/now-playing';
import SongSelector from '../../components/song-selector';
import PlayerContainer from '../../components/player-container';

export class UnconnectedHostPage extends React.Component {
  constructor(props) {
    super();

    props.dispatch(changeRoom(props.match.params.room));
  }

  componentWillReceiveProps(newProps) {
    const { dispatch, match } = newProps;

    if (this.props.match.params.room !== match.params.room) {
      dispatch(changeRoom(match.params.room));
    }
  }

  render() {
    const { isLoading, isValid } = this.props.room;
    if (isLoading) {
      return <div><h2>Looking for room...</h2></div>;
    } else if (isValid) {
      return (
        <div style={{ padding: '75px 0 0 0' }}>
          <NowPlaying showControls />
          <SongSelector />
          <PlayerContainer />
        </div>
      );
    }

    return <div><h2>Room does not exist</h2></div>;
  }
}

UnconnectedHostPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      room: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  room: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    room: state.room,
  };
}

export default connect(mapStateToProps)(UnconnectedHostPage);
