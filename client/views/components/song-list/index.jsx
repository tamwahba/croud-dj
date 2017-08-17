import PropTypes from 'prop-types';
import React from 'react';

import { VoteDirections } from '../../../core/song';
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
    songList,
    userID } = props;
  const { songs, order } = songList;

  let accessory;
  if (showVotes) {
    accessory = (id, song) => {
      const vote = song.votes.get(userID, '');
      const disableDownVote = vote === VoteDirections.DOWN;
      const disableUpVote = vote === VoteDirections.UP;

      return (
        <Vote
          count={song.score * -1}
          disableDownVote={disableDownVote}
          disableUpVote={disableUpVote}
          id={id}
          onDownVote={onSongDownVote}
          onUpVote={onSongUpVote}
        />
      );
    };
  } else if (showReplay) {
    accessory = id => (
      <Button className="button" onClick={handleReplayClick(id, onSongReplay)}>
        replay
      </Button>
    );
  } else {
    accessory = props.accessory;
  }

  return (
    <ol className={`song-list ${className}`}>
      {order.map((songKey) => {
        const song = songs.get(songKey);
        return (
          <li className="song-list__item" key={songKey}>
            <SongCard song={song} accessory={accessory(songKey, song)} />
          </li>
        );
      })}
    </ol>
  );
}

SongList.defaultProps = {
  accessory: () => null,
  className: '',
  onSongDownVote: () => null,
  onSongReplay: () => null,
  onSongUpVote: () => null,
  showReplay: false,
  showVotes: false,
  songList: new SongListState(),
  userID: '',
};

SongList.propTypes = {
  accessory: PropTypes.func,
  className: PropTypes.string,
  onSongDownVote: PropTypes.func,
  onSongReplay: PropTypes.func,
  onSongUpVote: PropTypes.func,
  showReplay: PropTypes.bool,
  showVotes: PropTypes.bool,
  songList: PropTypes.instanceOf(SongListState),
  userID: PropTypes.string,
};

export default SongList;
