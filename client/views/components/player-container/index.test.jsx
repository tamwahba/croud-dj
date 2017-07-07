/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import PlayerContainer from './index';
import YoutubePlayer from '../youtube-player';


expect.extend(enzymify());

describe('views', () => {
  describe('components', () => {
    describe('player-container', () => {
      let playerContainer;

      beforeEach(() => {
        playerContainer = shallow(<PlayerContainer />);
      });

      it('should have class `player-container player-container--youtube`', () => {
        expect(playerContainer)
          .toHaveClass('player-container')
          .toHaveClass('player-container--youtube');
      });

      it('should have a child YoutubePlayer', () => {
        expect(playerContainer).toContain(YoutubePlayer);
      });
    });
  });
});
