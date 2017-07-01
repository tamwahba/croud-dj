/* eslint-env mocha */
import { mount, shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import { YoutubePlayer } from './index';

expect.extend(enzymify());

describe('views', () => {
  describe('components', () => {
    describe('youtube-player', () => {
      const promise = Promise.resolve();
      const mockDispatch = expect.createSpy().andReturn(promise);
      const mockPlayer = {
        loadVideoById: expect.createSpy(),
        pauseVideo: expect.createSpy(),
        playVideo: expect.createSpy(),
      };
      let youtubePlayer;

      beforeEach(() => {
        mockDispatch.reset();
        mockPlayer.loadVideoById.reset();
        mockPlayer.pauseVideo.reset();
        mockPlayer.playVideo.reset();
        youtubePlayer = shallow(
          <YoutubePlayer songID="" status="" dispatch={mockDispatch} player={mockPlayer} />);
      });

      it('should render an iframe', () => {
        expect(youtubePlayer).toBeAn('iframe');
      });

      it('should have class `.youtube-player`', () => {
        expect(youtubePlayer).toHaveClass('youtube-player');
      });

      it('should call dispatch twice when mounted', () => {
        youtubePlayer = mount(
          <YoutubePlayer songID="" status="" dispatch={mockDispatch} player={mockPlayer} />);

        return promise.then().then().then(() => expect(mockDispatch.calls.length).toEqual(2));
      });

      it('should call player.loadVideoById when songID changes', () => {
        youtubePlayer.setProps({ songID: 's' });
        expect(mockPlayer.loadVideoById).toHaveBeenCalled();
      });

      it('should call player.pauseVideo when status changes to PAUSED', () => {
        youtubePlayer.setProps({ status: 'PAUSED' });
        expect(mockPlayer.pauseVideo).toHaveBeenCalled();
      });

      it('should call player.playVideo when status changes to PLAYING', () => {
        youtubePlayer.setProps({ status: 'PLAYING' });
        expect(mockPlayer.playVideo).toHaveBeenCalled();
      });

      it('should not call anything when status changes to anything else', () => {
        youtubePlayer.setProps({ status: '_' });
        expect(mockPlayer.playVideo).toNotHaveBeenCalled();
        expect(mockPlayer.pauseVideo).toNotHaveBeenCalled();
      });
    });
  });
});
