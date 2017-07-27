/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import Button from './index';

expect.extend(enzymify);

describe('views', () => {
  describe('components', () => {
    describe('button', () => {
      const children = <div><span>child</span></div>;
      const className = 'class';
      const onClick = expect.createSpy();

      let button;

      beforeEach(() => {
        button = shallow(<Button className={className} onClick={onClick}>{children}</Button>);
        onClick.reset();
      });

      it('should render a button', () => {
        expect(button).toBeA('button');
      });

      it('should have class `.button`', () => {
        expect(button).toHaveClass('button');
      });

      it('should contain element from prop children', () => {
        expect(button.contains(children)).toBe(true);
      });

      it('should have class from prop className', () => {
        expect(button).toHaveClass(className);
      });

      it('should call prop onClick when clicked', () => {
        button.simulate('click');

        expect(onClick).toHaveBeenCalled();
      });
    });
  });
});
