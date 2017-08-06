import { List } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { searchClear } from '../../../core/search';
import { SongStatuses } from '../../../core/song';
import { addSong, SongListState } from '../../../core/song-lists';

import Button from '../button';
import SongList from '../song-list';

export function UnconnectedSearchResults(props) {
  const { addToQueue, clearResults, isLoading, results } = props;
  const accessory = songKey => (
    <Button
      onClick={(event) => { event.preventDefault(); addToQueue(results.get(songKey)); clearResults(); }}
    >Play</Button>);
  const songs = new SongListState({
    order: results.keySeq().toList(),
    songs: results.toMap(),
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }
  return <SongList accessory={accessory} songList={songs} />;
}

UnconnectedSearchResults.propTypes = {
  addToQueue: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  results: PropTypes.instanceOf(List).isRequired,
};

export function mapStateToProps(state) {
  return {
    isLoading: state.search.isLoading,
    results: state.search.results,
    room: state.room,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    addToQueue: roomName => song => dispatch(addSong(
      roomName, 'queue', song.merge({ elapsed: 0, status: SongStatuses.UNSTARTED }).toJS())),
    clearResults: () => dispatch(searchClear()),
  };
}

export function mergeProps(stateProps, dispatchProps) {
  return {
    addToQueue: dispatchProps.addToQueue(stateProps.room.name),
    clearResults: dispatchProps.clearResults,
    isLoading: stateProps.isLoading,
    results: stateProps.results,
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(UnconnectedSearchResults);
