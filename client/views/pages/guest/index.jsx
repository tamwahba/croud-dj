import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { checkRoomExists } from '../../../core/room';

import TextInput from '../../components/text-input';

import './styles.less';

export class UnconnectedGuestPage extends React.Component {
  constructor() {
    super();

    this.navigateToRoom = this.navigateToRoom.bind(this);
    this.validateRoom = this.validateRoom.bind(this);
  }

  navigateToRoom(value, isValid) {
    const { history } = this.props;
    if (isValid) {
      history.push(`/guest/${value}`);
    }
  }

  validateRoom(value) {
    return this.props.checkRoomExists(value)
      .then(exists => ({ errorText: 'Does not exist', isValid: exists }));
  }

  render() {
    const { user } = this.props;

    return (
      <div className="guest">
        <h4>Join a room</h4>
        <TextInput
          label="Room Name"
          onCommit={this.navigateToRoom}
          validate={this.validateRoom}
        />
      </div>
    );
  }
}

UnconnectedGuestPage.propTypes = {
  checkRoomExists: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ checkRoomExists }, dispatch);
}

export default connect(undefined, mapDispatchToProps)(UnconnectedGuestPage);
