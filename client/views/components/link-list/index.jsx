import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router-dom';

import './styles.less';

function LinkList(props) {
  const { links } = props;
  return (
    <ul className="link-list">
      {links.map(link => (
        <li className="link-list__item" key={link.get('url')}>
          <Link to={link.get('url')} className="link-list__link">{link.get('text')}</Link>
        </li>))}
    </ul>
  );
}

LinkList.propTypes = {
  links: ImmutablePropTypes.listOf(ImmutablePropTypes.contains({
    text: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
};

export default LinkList;
