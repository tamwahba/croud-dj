import PropTypes from 'prop-types';
import React from 'react';

function FormattedTime({ time }) {
  const hours = Math.floor(time / 3600);
  const minutes = `0${Math.floor((time % 3600) / 60)}`.slice(-2);
  const seconds = `0${Math.floor(time % 60)}`.slice(-2);

  if (hours > 0) {
    return <span>{hours}:{minutes}:{seconds}</span>;
  }
  return <span>{minutes}:{seconds}</span>;
}

FormattedTime.propTypes = {
  time: PropTypes.number.isRequired,
};

export default FormattedTime;
