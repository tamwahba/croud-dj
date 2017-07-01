import PropTypes from 'prop-types';
import React from 'react';

import './styles.less';

export function ProgressBar({ className, percentComplete }) {
  return (
    <div className={`progress-bar ${className}`}>
      <div className="progress-bar__completed" style={{ width: `${percentComplete}%` }} />
    </div>
  );
}

ProgressBar.defaultProps = {
  className: '',
};

ProgressBar.propTypes = {
  className: PropTypes.string,
  percentComplete: PropTypes.number.isRequired,
};

export default ProgressBar;
