import PropTypes from 'prop-types';
import React from 'react';

import './styles.less';

function Icon(props) {
  const { alt, className, data } = props;

  return (
    <svg className={`icon ${className}`} aria-label={alt} viewBox={data.viewBox}>
      <title>{alt}</title>
      <use xlinkHref={data.url} />
    </svg>
  );
}

Icon.defaultProps = {
  className: '',
};

Icon.propTypes = {
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  data: PropTypes.shape({
    url: PropTypes.string.isRequired,
    viewBox: PropTypes.string.isRequired,
  }).isRequired,
};

export default Icon;
