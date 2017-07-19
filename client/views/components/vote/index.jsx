import PropTypes from 'prop-types';
import React from 'react';

import chevronUp from './chevron-up.svg';
import chevronDown from './chevron-down.svg';

import Button from '../button';
import Icon from '../icon';

import './styles.less';

class Vote extends React.Component {
  constructor() {
    super();

    this.handleDownVoteClick = this.handleDownVoteClick.bind(this);
    this.handleUpVoteClick = this.handleUpVoteClick.bind(this);
  }

  handleDownVoteClick(event) {
    const { id, onDownVote } = this.props;

    event.preventDefault();

    onDownVote(id);
  }

  handleUpVoteClick(event) {
    const { id, onUpVote } = this.props;

    event.preventDefault();

    onUpVote(id);
  }

  render() {
    const { className, count } = this.props;

    return (
      <div className={`vote ${className}`}>
        <Button className="vote__button" onClick={this.handleUpVoteClick}>
          <Icon data={chevronUp} alt="up vote" />
        </Button>
        <span className="vote__count">{count}</span>
        <Button className="vote__button" onClick={this.handleDownVoteClick}>
          <Icon data={chevronDown} alt="down vote" />
        </Button>
      </div>
    );
  }
}

Vote.defaultProps = {
  className: '',
};

Vote.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  onDownVote: PropTypes.func.isRequired,
  onUpVote: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
};

export default Vote;
