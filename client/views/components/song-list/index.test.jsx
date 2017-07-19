/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import { List, Map } from 'immutable';
import React from 'react';

import { SongListState, SongState } from '../../../core/song-lists';


import SongList from './index';

expect.extend(enzymify);

describe('views', () => {
  describe('components', () => {
    describe('song list', () => {
      const className = 'class';
      const list = new SongListState({ order: new List(['song']), songs: new Map({ song: new SongState() }) });
      const songDownVote = expect.createSpy();
      const songReplay = expect.createSpy();
      const songUpVote = expect.createSpy();

      let songList;

      beforeEach(() => {
        songDownVote.reset();
        songReplay.reset();
        songUpVote.reset();

        songList = shallow(<SongList
          className={className}
          onSongDownVote={songDownVote}
          onSongReplay={songReplay}
          onSongUpVote={songUpVote}
          songList={list}
        />);
      });

      it('should be an ordered list', () => {
        expect(songList).toBeAn('ol');
      });

      it('should have class `.song-list`', () => {
        expect(songList).toHaveClass('song-list');
      });

      it('should have element `li.song-list__item when songList is greater than 0', () => {
        expect(songList).toContain('li.song-list__item');
      });

      it('should have a list item per song', () => {
        expect(songList.find('li').length).toEqual(1);

        songList = shallow(<SongList
          className={className}
          onSongDownVote={songDownVote}
          onSongReplay={songReplay}
          onSongUpVote={songUpVote}
          songList={new SongListState()}
        />);

        expect(songList.find('li').length).toEqual(0);
      });

      it('should have element `Vote` when prop showVotes is true', () => {
        songList = shallow(<SongList
          className={className}
          onSongDownVote={songDownVote}
          onSongReplay={songReplay}
          onSongUpVote={songUpVote}
          showVotes
          songList={list}
        />);

        expect(songList.find('SongCard').shallow()).toContain('Vote');
      });

      it('should pass prop onSongDownVote to Vote', () => {
        songList = shallow(<SongList
          className={className}
          onSongDownVote={songDownVote}
          onSongReplay={songReplay}
          onSongUpVote={songUpVote}
          showVotes
          songList={list}
        />);

        expect(songList
          .find('SongCard').shallow()
          .find('Vote').last()).toHaveProp('onDownVote', songDownVote);
      });

      it('should pass prop onSongUpVote to Vote', () => {
        songList = shallow(<SongList
          className={className}
          onSongDownVote={songDownVote}
          onSongReplay={songReplay}
          onSongUpVote={songUpVote}
          showVotes
          songList={list}
        />);

        expect(songList
          .find('SongCard').shallow()
          .find('Vote').first()).toHaveProp('onUpVote', songUpVote);
      });

      it('should have a replay button when prop showReplay is true', () => {
        songList = shallow(<SongList
          className={className}
          onSongDownVote={songDownVote}
          onSongReplay={songReplay}
          onSongUpVote={songUpVote}
          showReplay
          songList={list}
        />);

        expect(songList
          .find('SongCard').shallow()
          .find('Button').shallow()
          .text()).toEqual('replay');
      });

      it('should call prop onSongReplay when replay button is clicked', () => {
        songList = shallow(<SongList
          className={className}
          onSongDownVote={songDownVote}
          onSongReplay={songReplay}
          onSongUpVote={songUpVote}
          showReplay
          songList={list}
        />);

        songList
          .find('SongCard').shallow()
          .find('Button').simulate('click', { preventDefault: () => null });

        expect(songReplay).toHaveBeenCalled();
      });
    });
  });
});
