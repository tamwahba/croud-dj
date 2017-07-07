/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import { Controls } from './index';

expect.extend(enzymify());

describe('views', () => {
  describe('components', () => {
    describe('controls', () => {
      let controls;
      let onClickNext;
      let onClickPause;
      let onClickPlay;
      let status;

      beforeEach(() => {
        onClickNext = expect.createSpy();
        onClickPause = expect.createSpy();
        onClickPlay = expect.createSpy();
        status = 'BUFFERING';

        controls = shallow(<Controls
          onClickNext={onClickNext}
          onClickPause={onClickPause}
          onClickPlay={onClickPlay}
          status={status}
        />);
      });

      it('should have class `.controls`', () => {
        expect(controls).toHaveClass('controls');
      });

      it('should render 2 buttons with class `.controls__button`', () => {
        const buttons = controls.find('button.controls__button');
        expect(buttons.length).toEqual(2);
      });

      it('should add className from its props', () => {
        controls.setProps({ className: 'class' });
        expect(controls).toHaveClass('class');
      });

      it('should render 1 button when status is unknown', () => {
        controls.setProps({ status: '' });

        const buttons = controls.find('button.controls__button');
        expect(buttons.length).toEqual(1);
      });

      it('should render a next button', () => {
        const nextButton = <button className="controls__button" onClick={onClickNext}>Next</button>;
        expect(controls.containsMatchingElement(nextButton)).toBe(true);
      });


      it('should render a buffering button when buffering', () => {
        const loadingButton =
          <button className="controls__button controls__button--status">Loading</button>;
        expect(controls.containsMatchingElement(loadingButton)).toBe(true);
      });

      it('should render an error button when error', () => {
        controls.setProps({ status: 'ERROR' });

        const errorButton =
          <button className="controls__button controls__button--status">Error</button>;
        expect(controls.containsMatchingElement(errorButton)).toBe(true);
      });

      it('should render a play button when paused', () => {
        controls.setProps({ status: 'PAUSED' });

        const errorButton =
          <button className="controls__button">Play</button>;
        expect(controls.containsMatchingElement(errorButton)).toBe(true);
      });

      it('should render a pause button when playing', () => {
        controls.setProps({ status: 'PLAYING' });

        const errorButton =
          <button className="controls__button">Pause</button>;
        expect(controls.containsMatchingElement(errorButton)).toBe(true);
      });

      it('should call onClickNext when next is clicked', () => {
        const nextButton = controls.children('button').findWhere(node => node.contains('Next')).first();
        nextButton.simulate('click');

        expect(onClickNext).toHaveBeenCalled();
      });

      it('should call onClickPause when pause is clicked', () => {
        controls.setProps({ status: 'PLAYING' });

        const pauseButton = controls.children('button').findWhere(node => node.contains('Pause')).first();
        pauseButton.simulate('click');

        expect(onClickPause).toHaveBeenCalled();
      });

      it('should call onClickPlay when play is clicked', () => {
        controls.setProps({ status: 'PAUSED' });

        const playButton = controls.children('button').findWhere(node => node.contains('Play')).first();
        playButton.simulate('click');

        expect(onClickPlay).toHaveBeenCalled();
      });
    });
  });
});
