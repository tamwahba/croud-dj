/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import { UnconnectedHostPage } from './index';

import { SongListState } from '../../../core/song-lists';
import { UserState } from '../../../core/users';

expect.extend(enzymify());

describe('views', () => {
  describe('pages', () => {
    describe('host', () => {
      const changeRoom = expect.createSpy();
      const dispatch = expect.createSpy().andReturn(Promise.resolve());
      let host;

      beforeEach(() => {
        changeRoom.reset();
        dispatch.reset();

        host = shallow(
          <UnconnectedHostPage
            changeRoom={changeRoom}
            dispatch={dispatch}
            match={{ params: { room: 'name' } }}
            played={new SongListState()}
            queue={new SongListState()}
            room={{ isLoading: false, isValid: true, name: 'name', owner: 'owner' }}
            user={new UserState({ id: 'owner' })}
          />);
      });

      it('should have class `.host`', () => {
        expect(host).toHaveClass('host');
      });

      it('should call prop changeRoom on navigation change', () => {
        expect(changeRoom).toHaveBeenCalled();
      });

      it('should call prop changeRoom on url change', () => {
        host.setProps({
          match: {
            params: {
              room: 'other-name',
            },
          },
        });
        expect(changeRoom.calls.length).toEqual(2);
      });

      it('should render a loading screen when room.isValid and room.isLoading are false', () => {
        host.setProps({
          room: {
            name: '',
            isLoading: false,
            isValid: false,
            owner: 'owner',
          },
        });

        expect(host).toHaveRendered(<div><h2>Room does not exist</h2></div>);
      });
    });
  });
});
