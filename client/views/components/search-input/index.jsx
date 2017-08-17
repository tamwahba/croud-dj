import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { search } from '../../../core/search';

import TextInput from '../text-input';

export class UnconnectedSearchInput extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.props.search(value);
  }

  render() {
    return (
      <TextInput
        label="Add Song"
        onChange={this.handleChange}
        onCommit={this.props.search}
        value={this.props.query}
      />
    );
  }
}

UnconnectedSearchInput.propTypes = {
  query: PropTypes.string.isRequired,
  search: PropTypes.func.isRequired,
};

export function mapStateToProps(state) {
  return {
    query: state.search.query,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    search: query => dispatch(search(query)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedSearchInput);
