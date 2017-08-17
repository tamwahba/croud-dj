import PropTypes from 'prop-types';
import React from 'react';

import './styles.less';

function Button(props) {
  const { onClick, children, className, disabled } = props;
  return <button className={`button ${className}`} disabled={disabled} onClick={onClick}>{children}</button>;
}

Button.defaultProps = {
  onClick: () => null,
  children: null,
  className: '',
  disabled: false,
};

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
