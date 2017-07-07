import React from 'react';

import YoutubePlayer from '../youtube-player';

import './styles.less';

function PlayerContainer() {
  return (
    <div className="player-container player-container--youtube">
      <YoutubePlayer />
    </div>
  );
}

export default PlayerContainer;
