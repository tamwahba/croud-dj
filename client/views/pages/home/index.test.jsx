/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import HomePage from './index';

expect.extend(enzymify());

describe('views', () => {
  describe('pages', () => {
    describe('home', () => {
      it('should have class `home`', () => {
        const home = shallow(<HomePage />);
        expect(home).toHaveClass('home');
      });
    });
  });
});
