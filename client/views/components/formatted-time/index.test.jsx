/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import FormattedTime from './index';

expect.extend(enzymify());

describe('views', () => {
  describe('components', () => {
    describe('formatted-time', () => {
      it('should format hours from seconds', () => {
        const time = shallow(<FormattedTime time={3600} />);
        expect(time).toHaveRendered(<span>1:00:00</span>);
      });

      it('should format minutes from seconds', () => {
        const time = shallow(<FormattedTime time={600} />);
        expect(time).toHaveRendered(<span>10:00</span>);
      });

      it('should zero pad minutes', () => {
        const time = shallow(<FormattedTime time={60} />);
        expect(time).toHaveRendered(<span>01:00</span>);
      });

      it('should zero pad seconds', () => {
        const time = shallow(<FormattedTime time={6} />);
        expect(time).toHaveRendered(<span>00:06</span>);
      });

      it('should zero pad 0', () => {
        const time = shallow(<FormattedTime time={0} />);
        expect(time).toHaveRendered(<span>00:00</span>);
      });
    });
  });
});
