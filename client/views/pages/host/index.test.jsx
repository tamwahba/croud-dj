/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import { UnconnectedHostPage } from './index';

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
          />);
      });

      afterEach(() => {
        dispatch.reset();
      });

      it('should have a top padding', () => {
        expect(host.getNode().props.style.padding).toEqual('75px 0 0 0');
      });

      it('should call dispatch on url change', () => {
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

      it('should render a loading screen when room.isLoading is true', () => {
        host.setProps({
          room: {
            name: '',
            isLoading: true,
            isValid: false,
          },
        });

        expect(host).toHaveRendered(<div><h2>Looking for room...</h2></div>);
      });

      it('should render a loading screen when room.isValid is false', () => {
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
