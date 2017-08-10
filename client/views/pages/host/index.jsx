import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { checkRoomExists, createRoom } from '../../../core/room';
import { UserState } from '../../../core/users';

import LinkList from '../../components/link-list';
import TextInput from '../../components/text-input';

import './styles.less';

export class UnconnectedHostPage extends React.Component {
  constructor() {
    super();

    this.navigateToRoom = this.navigateToRoom.bind(this);
    this.validateRoom = this.validateRoom.bind(this);
  }

  navigateToRoom(value, isValid) {
    const { history, user } = this.props;
    if (isValid) {
      this.props.createRoom(value, user.id)
        .then(() => history.push(`/host/${value}`));
    }
  }

  validateRoom(value) {
    return this.props.checkRoomExists(value)
      .then(exists => ({ errorText: 'Already exists', isValid: exists }));
  }

  render() {
    const { user } = this.props;

    return (
      <div className="host">
        <h4>Create a new room</h4>
        <TextInput
          label="Room Name"
          onCommit={this.navigateToRoom}
          validate={this.validateRoom}
        />
        {!user.roomIDs.isEmpty() && [
          <h4 key="contiue">Continue hosting previous room</h4>,
          <LinkList links={user.roomIDs.map(id => new Map({ url: `/host/${id}`, text: id }))} key="roomList" />,
        ]}
      </div>
    );
  }
}

UnconnectedHostPage.defaultProps = {
  user: new UserState(),
};

UnconnectedHostPage.propTypes = {
  checkRoomExists: PropTypes.func.isRequired,
  createRoom: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.instanceOf(UserState),
};

function mapStateToProps(state) {
  return {
    user: state.users.get(state.currentUser.id),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ checkRoomExists, createRoom }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedHostPage);
