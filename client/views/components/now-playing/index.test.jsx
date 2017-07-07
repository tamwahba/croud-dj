/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import { NowPlaying } from './index';

expect.extend(enzymify());

describe('views', () => {
  describe('components', () => {
    describe('now-playing', () => {
      const currentSong = {
        artist: 'artist',
        elapsed: 10,
        duration: 100,
        title: 'artist',
      };
      let nowPlaying;

      beforeEach(() => {
        nowPlaying = shallow(<NowPlaying currentSong={currentSong} showControls />);
      });

      it('should have class `.now-playing`', () => {
        expect(nowPlaying).toHaveClass('now-playing');
      });

      it('should have a child with class `.now-playing__heading`', () => {
        expect(nowPlaying).toContain('.now-playing__heading');
      });

      it('should have a child with class `.now-playing__info`', () => {
        expect(nowPlaying).toContain('.now-playing__info');
      });

      it('should not render controls when showControls is false', () => {
        nowPlaying.setProps({ showControls: false });
        expect(nowPlaying).toNotContain('.now-playing__info__controls');
      });
    });
  });
});
