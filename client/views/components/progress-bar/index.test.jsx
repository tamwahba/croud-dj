/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import { ProgressBar } from './index';

expect.extend(enzymify());

describe('views', () => {
  describe('components', () => {
    describe('progress-bar', () => {
      let progressBar;

      beforeEach(() => {
        progressBar = shallow(<ProgressBar percentComplete={0} />);
      });

      it('should have class `.progress-bar', () => {
        expect(progressBar).toHaveClass('progress-bar');
      });

      it('should have child with class `.progress-bar__completed', () => {
        expect(progressBar).toContain('.progress-bar__completed');
      });

      it('should add className from its props', () => {
        progressBar.setProps({ className: 'class' });
        expect(progressBar).toHaveClass('class');
      });

      it('should set the width of its child based on elapsed and duration', () => {
        const percentComplete = 50;
        progressBar.setProps({ percentComplete });
        const inner = progressBar.find('.progress-bar__completed');
        expect(inner.getNode().props.style.width).toEqual(`${percentComplete}%`);
      });
    });
  });
});
