/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import { UnconnectedHostPage } from './index';

import { SongListState } from '../../../core/song-lists';

expect.extend(enzymify());

describe('views', () => {
  describe('pages', () => {
    describe('host', () => {
      const dispatch = expect.createSpy().andReturn(Promise.resolve());
      let host;

      beforeEach(() => {
        host = shallow(
          <UnconnectedHostPage
            dispatch={dispatch}
            match={{ params: { room: 'name' } }}
            room={{ name: 'name', isLoading: false, isValid: true }}
            played={new SongListState()}
            queue={new SongListState()}
          />);
      });

      afterEach(() => {
        dispatch.reset();
      });

      it('should have class `.host`', () => {
        expect(host).toHaveClass('host');
      });

      it('should call dispatch on navigation change', () => {
        expect(dispatch.calls.length).toEqual(1);
      });

      it('should call dispatch on url change', () => {
        host.setProps({
          match: {
            params: {
              room: 'other-name',
            },
          },
        });
        expect(dispatch.calls.length).toEqual(2);
      });

      it('should render a loading screen when room.isValid and room.isLoading are false', () => {
        host.setProps({
          room: {
            name: '',
            isLoading: false,
            isValid: false,
          },
        });

        expect(host).toHaveRendered(<div><h2>Room does not exist</h2></div>);
      });
    });
  });
});
