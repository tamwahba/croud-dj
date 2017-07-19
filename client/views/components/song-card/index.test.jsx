/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import { SongState } from '../../../core/song-lists';

import SongCard from './index';

expect.extend(enzymify);

describe('views', () => {
  describe('components', () => {
    describe('song card', () => {
      const accessory = <div />;
      const artist = 'artist';
      const artwork = 'artwork';
      const title = 'title';

      const song = new SongState({
        artist,
        artwork,
        title,
      });

      let songCard;

      beforeEach(() => {
        songCard = shallow(<SongCard accessory={accessory} song={song} />);
      });

      it('should have class `.song-card`', () => {
        expect(songCard).toHaveClass('song-card');
      });

      it('should have element `div.song-card__artwork-container img`', () => {
        expect(songCard).toContain('div.song-card__artwork-container img');
      });

      it('should have element `div.song-card__group`', () => {
        expect(songCard).toContain('div.song-card__group');
      });

      it('should have element `span.song-card__artist` when provided', () => {
        expect(songCard).toContain('span.song-card__artist');
      });

      it('should not have element `.song-card__artist` when it is falsy', () => {
        songCard = shallow(<SongCard accessory={accessory} song={new SongState()} />);
        expect(songCard).toNotContain('.song-card__artist');
      });

      it('should have element `span.song-card__title`', () => {
        expect(songCard).toContain('span.song-card__title');
      });

      it('should have element `.song-card__accessory` when provided', () => {
        expect(songCard).toContain('.song-card__accessory');
      });

      it('should not have element `.song-card__accessory` when it is falsy', () => {
        songCard = shallow(<SongCard song={song} />);
        expect(songCard).toNotContain('.song-card__accessory');
      });
    });
  });
});
