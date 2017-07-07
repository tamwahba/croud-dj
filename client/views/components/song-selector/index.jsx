import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { currentSongUpdate } from '../../../core/current-song';

class SongSelector extends React.Component {
  constructor() {
    super();
    this.state = { songID: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(target) {
    if (target.charCode === 13) {
      this.props.dispatch(currentSongUpdate({ id: this.state.songID }));
    }
  }

  handleChange(event) {
    this.setState({ songID: event.target.value });
  }

  render() {
    return (
      <div>
        <label htmlFor="#songID">Song ID: </label>
        <input
          id="songID"
          value={this.state.songID}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
      </div>
    );
  }
}

SongSelector.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(SongSelector);
