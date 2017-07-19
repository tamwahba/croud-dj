/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import Icon from './index';

expect.extend(enzymify);

describe('views', () => {
  describe('components', () => {
    describe('icon', () => {
      const alt = 'alt text';
      const className = 'class';
      const data = {
        url: 'url',
        viewBox: 'view box',
      };

      let icon;

      beforeEach(() => {
        icon = shallow(<Icon alt={alt} className={className} data={data} />);
      });

      it('should render an svg', () => {
        expect(icon).toBeAn('svg');
      });

      it('should have class `.icon`', () => {
        expect(icon).toHaveClass('icon');
      });

      it('should have aria-label from prop alt', () => {
        expect(icon).toHaveProp('aria-label', alt);
      });

      it('should have title element from prop alt', () => {
        expect(icon.contains(<title>{alt}</title>)).toBe(true);
      });

      it('should have class from prop className', () => {
        expect(icon).toHaveClass(className);
      });

      it('should have viewBox from prop data.viewBox', () => {
        expect(icon).toHaveProp('viewBox', data.viewBox);
      });

      it('should have use element from prop data.url', () => {
        expect(icon.contains(<use xlinkHref={data.url} />)).toBe(true);
      });
    });
  });
});
