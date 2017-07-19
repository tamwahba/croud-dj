import PropTypes from 'prop-types';
import React from 'react';

import { SongListState } from '../../../core/song-lists';

import Button from '../button';
import SongCard from '../song-card';
import Vote from '../vote';

import './styles.less';

function handleReplayClick(id, cb) {
  return (event) => {
    event.preventDefault();
    cb(id);
  };
}

function SongList(props) {
  const { className,
    onSongUpVote,
    onSongDownVote,
    onSongReplay,
    showReplay,
    showVotes,
    songList } = props;
  const { songs, order } = songList;

  let accessory;
  if (showVotes) {
    accessory = (id, votes) => (
      <Vote count={votes} id={id} onDownVote={onSongDownVote} onUpVote={onSongUpVote} />
    );
  } else if (showReplay) {
    accessory = id => (
      <Button className="button" onClick={handleReplayClick(id, onSongReplay)}>
        replay
      </Button>
    );
  } else {
    accessory = () => null;
  }

  return (
    <ol className={`song-list ${className}`}>
      {order.map((songKey) => {
        const song = songs.get(songKey);
        return (
          <li className="song-list__item" key={songKey}>
            <SongCard song={song} accessory={accessory(songKey, song.votes * -1)} />
          </li>
        );
      })}
    </ol>
  );
}

SongList.defaultProps = {
  className: '',
  onSongDownVote: () => null,
  onSongReplay: () => null,
  onSongUpVote: () => null,
  showReplay: false,
  showVotes: false,
  songList: new SongListState(),
};

SongList.propTypes = {
  className: PropTypes.string,
  onSongDownVote: PropTypes.func,
  onSongReplay: PropTypes.func,
  onSongUpVote: PropTypes.func,
  showReplay: PropTypes.bool,
  showVotes: PropTypes.bool,
  songList: PropTypes.instanceOf(SongListState),
};

export default SongList;
