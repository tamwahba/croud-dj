/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import Immutable from 'immutable';
import React from 'react';

import { UnconnectedRoomPage } from './index';

import { SongState } from '../../../core/song';
import { SongListState } from '../../../core/song-lists';
import { RoomState } from '../../../core/room';
import { UserState } from '../../../core/users';

expect.extend(enzymify());

describe('views', () => {
  describe('pages', () => {
    describe('room', () => {
      const addSong = expect.createSpy();
      const changeRoom = expect.createSpy();
      const checkRoomExists = expect.createSpy();
      const createRoom = expect.createSpy();
      const downVoteSong = expect.createSpy();
      const push = expect.createSpy();
      const upVoteSong = expect.createSpy();

      let room;

      beforeEach(() => {
        addSong.reset();
        changeRoom.reset();
        checkRoomExists.reset();
        createRoom.reset();
        downVoteSong.reset();
        push.reset();
        upVoteSong.reset();

        room = shallow(
          <UnconnectedRoomPage
            addSong={addSong}
            changeRoom={changeRoom}
            checkRoomExists={checkRoomExists}
            createRoom={createRoom}
            downVoteSong={downVoteSong}
            history={{ push }}
            match={{ params: { id: 'name', type: 'host' } }}
            played={new SongListState({
              order: Immutable.fromJS(['played-song']),
              songs: Immutable.fromJS({ 'played-song': new SongState() }),
            })}
            queue={new SongListState()}
            room={new RoomState({ isLoading: false, isValid: true, name: 'name', owner: 'owner' })}
            user={new UserState({ id: 'owner' })}
            upVoteSong={upVoteSong}
          />);
      });

      it('should have class `.room`', () => {
        expect(room).toHaveClass('room');
      });

      it('should call prop changeRoom on construction', () => {
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

      it('should render an overlay when room id is invalid and page type is guest', () => {
        room.setProps({
          match: {
            params: {
              id: 'name',
              type: 'host',
            },
          },
          room: new RoomState({
            isLoading: false,
            isValid: false,
            owner: 'owner',
          }),
        });

        expect(room.find('.room__overlay').children().length).toNotEqual(0);
      });

      it('should render an overlay when room id is invalid and page type is host', () => {
        room.setProps({
          room: new RoomState({
            isLoading: false,
            isValid: false,
            owner: 'owner',
          }),
        });

        expect(room.find('.room__overlay').children().length).toNotEqual(0);
      });

      it('should render an overlay when user is not owner and page type is host', () => {
        room.setProps({
          room: new RoomState({
            isLoading: false,
            isValid: true,
            owner: 'not-owner',
          }),
        });

        expect(room.find('.room__overlay').children().length).toNotEqual(0);
      });

      describe('.guestRoom', () => {
        const value = 'value';

        it('should call prop history.push when isValid is true', () => {
          room.instance().guestRoom(value, true);

          expect(push).toHaveBeenCalled();
        });

        it('should call prop history.push when isValid is false', () => {
          room.instance().guestRoom(value, false);

          expect(push).toNotHaveBeenCalled();
        });
      });

      describe('.handleDownVote', () => {
        it('should call prop downVoteSong', () => {
          room.instance().handleDownVote();

          expect(downVoteSong).toHaveBeenCalled();
        });
      });

      describe('.handleReplay', () => {
        it('should call prop addSong', () => {
          room.instance().handleReplay('played-song');

          expect(addSong).toHaveBeenCalled();
        });
      });

      describe('.handleUpVote', () => {
        it('should call prop upVoteSong', () => {
          room.instance().handleUpVote();

          expect(upVoteSong).toHaveBeenCalled();
        });
      });

      describe('.hostNewRoom', () => {
        const promise = Promise.resolve();
        const value = 'value';

        beforeEach(() => {
          room.setProps({ createRoom: createRoom.andReturn(promise) });
        });

        it('should call prop hostRoom when isValid is true', () => {
          room.instance().hostNewRoom(value, true);

          expect(createRoom).toHaveBeenCalled();
        });

        it('should call prop hostRoom when isValid is false', () => {
          room.instance().hostNewRoom(value, false);

          expect(createRoom).toNotHaveBeenCalled();
        });

        it('should call prop history.push when isValid is true', () => {
          room.instance().hostNewRoom(value, true);

          return promise.then(() => {
            expect(push).toHaveBeenCalled();
          });
        });

        it('should call prop history.push when isValid is false', () => {
          room.instance().hostNewRoom(value, false);

          return promise.then(() => {
            expect(push).toNotHaveBeenCalled();
          });
        });
      });

      describe('.hostRoom', () => {
        const value = 'value';

        it('should call prop history.push when isValid is true', () => {
          room.instance().hostRoom(value, true);

          expect(push).toHaveBeenCalled();
        });

        it('should call prop history.push when isValid is false', () => {
          room.instance().hostRoom(value, false);

          expect(push).toNotHaveBeenCalled();
        });
      });

      describe('.validateNewRoom', () => {
        const exists = true;
        const promise = Promise.resolve(exists);
        const value = 'value';

        beforeEach(() => {
          room.setProps({ checkRoomExists: checkRoomExists.andReturn(promise) });
        });

        it('should return a promise', () => {
          expect(room.instance().validateNewRoom(value)).toBeA(Promise);
        });

        it('should call prop checkRoomExists', () => {
          room.instance().validateNewRoom(value);

          expect(checkRoomExists).toHaveBeenCalled();
        });

        it('should resolve with object with properties errorText and isValid', () => {
          return room.instance().validateNewRoom(value)
            .then((result) => {
              expect(result).toIncludeKeys(['errorText', 'isValid']);
            });
        });
      });

      describe('.validateRoom', () => {
        const exists = true;
        const promise = Promise.resolve(exists);
        const value = 'value';

        beforeEach(() => {
          room.setProps({ checkRoomExists: checkRoomExists.andReturn(promise) });
        });

        it('should return a promise', () => {
          expect(room.instance().validateRoom(value)).toBeA(Promise);
        });

        it('should call prop checkRoomExists', () => {
          room.instance().validateRoom(value);

          expect(checkRoomExists).toHaveBeenCalled();
        });

        it('should resolve with object with properties errorText and isValid', () => {
          return room.instance().validateRoom(value)
            .then((result) => {
              expect(result).toIncludeKeys(['errorText', 'isValid']);
            });
        });
      });
    });
  });
});
