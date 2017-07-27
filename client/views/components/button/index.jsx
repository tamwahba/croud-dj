import PropTypes from 'prop-types';
import React from 'react';

import './styles.less';

function Button(props) {
  const { onClick, children, className } = props;
  return <button className={`button ${className}`} onClick={onClick}>{children}</button>;
}

Button.defaultProps = {
  onClick: () => null,
  children: null,
  className: '',
};

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Button;
