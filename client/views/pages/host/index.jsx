import React from 'react';

import NowPlaying from '../../components/now-playing';
import SongSelector from '../../components/song-selector';
import PlayerContainer from '../../components/player-container';

function HostPage() {
  return (
    <div style={{ padding: '75px 0 0 0' }}>
      <NowPlaying showControls />
      <SongSelector />
      <PlayerContainer />
    </div>
  );
}

export default HostPage;
