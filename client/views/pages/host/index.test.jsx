/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import HostPage from './index';

expect.extend(enzymify());

describe('views', () => {
  describe('pages', () => {
    describe('host', () => {
      it('should have a top padding', () => {
        const host = shallow(<HostPage />);
        expect(host.getNode().props.style.padding).toEqual('75px 0 0 0');
      });
    });
  });
});
