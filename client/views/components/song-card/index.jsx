import PropTypes from 'prop-types';
import React from 'react';
import { SongState } from '../../../core/song-lists';

import './styles.less';

function SongCard(props) {
  const { accessory, song } = props;
  const { artist, artwork, title } = song;

  return (
    <div className="song-card">
      <div className="song-card__artwork-container">
        <img alt={`${title} thumbnail`} src={artwork} />
      </div>
      <div className="song-card__group">
        {artist && <span className="song-card__artist">{artist}</span>}
        <span className="song-card__title">{title}</span>
      </div>
      {accessory && React.cloneElement(accessory, { className: 'song-card__accessory' })}
    </div>
  );
}

SongCard.defaultProps = {
  accessory: null,
};

SongCard.propTypes = {
  accessory: PropTypes.element,
  song: PropTypes.instanceOf(SongState).isRequired,
};

export default SongCard;
