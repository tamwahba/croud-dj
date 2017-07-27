/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import { List } from 'immutable';
import React from 'react';

import { SongServices, SongState, SongStatuses } from '../../../core/song';
import { SongListState } from '../../../core/song-lists';
import YoutubePlayer from '../youtube-player';

import { mergeProps, UnconnectedPlayerContainer } from './index';

expect.extend(enzymify());

describe('views', () => {
  describe('components', () => {
    describe('player-container', () => {
      const addSongToPlayed = expect.createSpy();
      const play = expect.createSpy();
      const removeFromQueue = expect.createSpy();
      const song = new SongState({
        duration: 100,
        elapsed: 0,
        service: SongServices.YOUTUBE,
        status: SongStatuses.UNSTARTED,
      });
      let playerContainer;

      beforeEach(() => {
        addSongToPlayed.reset();
        play.reset();
        removeFromQueue.reset();

        playerContainer = shallow(<UnconnectedPlayerContainer
          addSongToPlayed={addSongToPlayed}
          play={play}
          removeFromQueue={removeFromQueue}
          song={song}
          queue={new SongListState()}
        />);
      });

      describe('mergeProps', () => {
        const mockStateProps = {
          room: 'r',
          song: new SongState(),
          queue: new SongListState(),
        };

        const mockDispatchProps = {
          addSong: expect.createSpy(),
          play: expect.createSpy(),
          removeSong: expect.createSpy(),
        };

        beforeEach(() => {
          mockDispatchProps.addSong.reset();
          mockDispatchProps.play.reset();
          mockDispatchProps.removeSong.reset();
        });

        it('should return key addSongToPlayed', () => {
          const addSong = mergeProps(mockStateProps, mockDispatchProps).addSongToPlayed;
          expect(addSong).toBeA('function');
          addSong(new SongState());
          expect(mockDispatchProps.addSong).toHaveBeenCalled();
        });

        it('should return key play from dispatchProps.play', () => {
          expect(mergeProps(mockStateProps, mockDispatchProps).play)
            .toEqual(mockDispatchProps.play);
        });

        it('should return key removeFromQueue', () => {
          const removeSong = mergeProps(mockStateProps, mockDispatchProps).removeFromQueue;
          expect(removeSong).toBeA('function');
          removeSong('');
          expect(mockDispatchProps.removeSong).toHaveBeenCalled();
        });

        it('should return key song from stateProps.song', () => {
          expect(mergeProps(mockStateProps, mockDispatchProps).song)
            .toEqual(mockStateProps.song);
        });

        it('should return key queue from stateProps.queue', () => {
          expect(mergeProps(mockStateProps, mockDispatchProps).queue)
            .toEqual(mockStateProps.queue);
        });
      });

      it('should have class `player-container player-container--youtube`', () => {
        expect(playerContainer)
          .toHaveClass('player-container')
          .toHaveClass('player-container--youtube');
      });

      it('should have a child YoutubePlayer when prop song.service is YOUTUBE', () => {
        expect(playerContainer).toContain(YoutubePlayer);
      });

      it('should call addSongToPlayed when song is not empty and is ending', () => {
        playerContainer.setProps({ song: song.merge({ elapsed: 99 }) });
        expect(addSongToPlayed).toHaveBeenCalled();
      });

      it('should call play and removeFromQueue when song is empty and queue is not empty', () => {
        playerContainer.setProps({ song: song.merge({ status: SongStatuses.EMPTY }) });
        playerContainer.setProps({ queue: new SongListState({ order: new List(['key']) }) });
        expect(play).toHaveBeenCalled();
        expect(removeFromQueue).toHaveBeenCalled();
      });


      it('should call play and removeFromQueue when song is ending and queue is not empty', () => {
        playerContainer.setProps({ song: song.merge({ elapsed: 99 }) });
        playerContainer.setProps({ queue: new SongListState({ order: new List(['key']) }) });
        expect(play).toHaveBeenCalled();
        expect(removeFromQueue).toHaveBeenCalled();
      });

      it('should call play when song is ending and queue is empty', () => {
        playerContainer.setProps({ song: song.merge({ elapsed: 99 }) });
        expect(play).toHaveBeenCalled();
      });
    });
  });
});
