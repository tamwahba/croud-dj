/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import expectImmutable from 'expect-immutable';
import Immutable, { List } from 'immutable';
import React from 'react';

import { UserState } from '../../../core/users';

import LinkList from '../../components/link-list';

import { UnconnectedHostPage } from './index';

expect.extend(enzymify());
expect.extend(expectImmutable);

describe('views', () => {
  describe('pages', () => {
    describe('host', () => {
      const checkRoomExists = expect.createSpy().andReturn(Promise.resolve(true));
      const createRoomPromise = Promise.resolve();
      const createRoom = expect.createSpy().andReturn(createRoomPromise);
      const push = expect.createSpy();
      const user = new UserState({
        roomIDs: new List(['id1', 'id2']),
      });

      let host;

      beforeEach(() => {
        checkRoomExists.reset();
        createRoom.reset();
        push.reset();

        host = shallow(<UnconnectedHostPage
          checkRoomExists={checkRoomExists}
          createRoom={createRoom}
          history={{ push }}
          user={user}
        />);
      });

      it('should have class `.host`', () => {
        expect(host).toHaveClass('host');
      });

      it('should contain a <LinkList />', () => {
        expect(host).toContain(LinkList);
      });

      it('should not contain a <LinkList /> when user.roomIDs is empty', () => {
        host.setProps({ user: user.set('roomIDs', new List()) });

        expect(host).toNotContain(LinkList);
      });

      it('should map room ids to Maps for <LinkList />', () => {
        expect(host.find(LinkList).prop('links'))
          .toEqualImmutable(Immutable.fromJS([
            { url: '/host/id1', text: 'id1' },
            { url: '/host/id2', text: 'id2' },
          ]));
      });

      describe('.navigateToRoom', () => {
        const value = 'value';
        it('should call prop createRoom when isValid is true', () => {
          host.instance().navigateToRoom(value, true);

          expect(createRoom).toHaveBeenCalledWith(value, user.id);
        });

        it('should call prop history.push when isValid is true', () => {
          host.instance().navigateToRoom(value, true);

          return createRoomPromise
            .then(() => {
              expect(push).toHaveBeenCalledWith(`/host/${value}`);
            });
        });

        it('should do nothinf when isValid is false', () => {
          host.instance().navigateToRoom(value, false);

          expect(createRoom).toNotHaveBeenCalled();
          expect(push).toNotHaveBeenCalled();
        });
      });

      describe('.validateRoom', () => {
        it('should call prop checkRoomExists', () => {
          const value = 'value';
          host.instance().validateRoom(value);

          expect(checkRoomExists).toHaveBeenCalledWith(value);
        });

        it('should resolve with object with properties errorText and isValid', () => {
          return host.instance().validateRoom()
            .then((result) => {
              expect(result).toIncludeKeys(['errorText', 'isValid']);
            });
        });
      });
    });
  });
});
