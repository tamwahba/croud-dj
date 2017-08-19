/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import { UnconnectedGuestPage } from './index';

expect.extend(enzymify());

describe('views', () => {
  describe('pages', () => {
    describe('guest', () => {
      const checkRoomExists = expect.createSpy().andReturn(Promise.resolve(true));
      const push = expect.createSpy();

      let guest;

      beforeEach(() => {
        checkRoomExists.reset();
        push.reset();

        guest = shallow(<UnconnectedGuestPage
          checkRoomExists={checkRoomExists}
          history={{ push }}
        />);
      });

      it('should have class `.guest`', () => {
        expect(guest).toHaveClass('guest');
      });

      describe('.navigateToRoom', () => {
        const value = 'value';
        it('should call prop history.push when isValid is true', () => {
          guest.instance().navigateToRoom(value, true);

          expect(push).toHaveBeenCalledWith(`/guest/${value}`);
        });

        it('should do nothing when isValid is false', () => {
          guest.instance().navigateToRoom(value, false);

          expect(push).toNotHaveBeenCalled();
        });
      });

      describe('.validateRoom', () => {
        it('should call prop checkRoomExists', () => {
          const value = 'value';
          guest.instance().validateRoom(value);

          expect(checkRoomExists).toHaveBeenCalledWith(value);
        });

        it('should resolve with object with properties errorText and isValid', () => {
          return guest.instance().validateRoom()
            .then((result) => {
              expect(result).toIncludeKeys(['errorText', 'isValid']);
            });
        });
      });
    });
  });
});
