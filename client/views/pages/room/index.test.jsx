/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import { UnconnectedRoomPage } from './index';

import { SongListState } from '../../../core/song-lists';
import { RoomState } from '../../../core/room';
import { UserState } from '../../../core/users';

expect.extend(enzymify());

describe('views', () => {
  describe('pages', () => {
    describe('room', () => {
      const addSong = expect.createSpy();
      const changeRoom = expect.createSpy();
      const downVoteSong = expect.createSpy();
      const upVoteSong = expect.createSpy();

      const room = shallow(
        <UnconnectedRoomPage
          addSong={addSong}
          changeRoom={changeRoom}
          downVoteSong={downVoteSong}
          match={{ params: { id: 'name', type: 'host' } }}
          played={new SongListState()}
          queue={new SongListState()}
          room={new RoomState({ isLoading: false, isValid: true, name: 'name', owner: 'owner' })}
          user={new UserState({ id: 'owner' })}
          upVoteSong={upVoteSong}
        />);

      beforeEach(() => {
        addSong.reset();
        changeRoom.reset();
        downVoteSong.reset();
        upVoteSong.reset();
      });

      it('should have class `.room`', () => {
        expect(room).toHaveClass('room');
      });

      it('should call prop changeRoom on construction', () => {
        shallow(
          <UnconnectedRoomPage
            addSong={addSong}
            changeRoom={changeRoom}
            downVoteSong={downVoteSong}
            match={{ params: { id: 'name', type: 'host' } }}
            played={new SongListState()}
            queue={new SongListState()}
            room={new RoomState({ isLoading: false, isValid: true, name: 'name', owner: 'owner' })}
            user={new UserState({ id: 'owner' })}
            upVoteSong={upVoteSong}
          />);

        expect(changeRoom).toHaveBeenCalled();
      });

      it('should call prop changeRoom on url change', () => {
        room.setProps({
          match: {
            params: {
              id: 'other-name',
              type: 'host',
            },
          },
        });
        expect(changeRoom).toHaveBeenCalled();
      });

      it('should render a not exists screen when room id is invalid', () => {
        room.setProps({
          room: new RoomState({
            isLoading: false,
            isValid: false,
            owner: 'owner',
          }),
        });

        expect(room).toHaveRendered(<div><h2>Room does not exist</h2></div>);
      });
    });
  });
});
