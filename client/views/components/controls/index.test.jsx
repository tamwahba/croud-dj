/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import { List } from 'immutable';
import React from 'react';

import Button from '../button';
import { SongStatuses, SongState } from '../../../core/song';
import { SongListState } from '../../../core/song-lists';

import { mergeProps, UnconnectedControls } from './index';

expect.extend(enzymify());

describe('views', () => {
  describe('components', () => {
    describe('controls', () => {
      let controls;
      const onClickNext = expect.createSpy();
      const onClickPause = expect.createSpy();
      const onClickPlay = expect.createSpy();
      let status;

      beforeEach(() => {
        onClickNext.reset();
        onClickPause.reset();
        onClickPlay.reset();
        status = SongStatuses.BUFFERING;

        controls = shallow(<UnconnectedControls
          nextKey="key"
          onClickNext={onClickNext}
          onClickPause={onClickPause}
          onClickPlay={onClickPlay}
          status={status}
        />);
      });

      describe('mergeProps', () => {
        const key = 'key';
        let mockStateProps;

        const mockDispatchProps = {
          addSong: expect.createSpy(),
          onClickPause: expect.createSpy(),
          onClickPlay: expect.createSpy(),
          play: expect.createSpy(),
          removeSong: expect.createSpy(),
        };

        beforeEach(() => {
          mockStateProps = {
            room: 'r',
            song: new SongState(),
            queue: new SongListState({ order: new List([key]) }),
          };

          mockDispatchProps.addSong.reset();
          mockDispatchProps.onClickPause.reset();
          mockDispatchProps.onClickPlay.reset();
          mockDispatchProps.play.reset();
          mockDispatchProps.removeSong.reset();
        });

        it('should return key nextKey from stateProps.queue.order.first', () => {
          expect(mergeProps(mockStateProps, mockDispatchProps).nextKey)
            .toEqual(key);
        });

        it('should return key onClickNext', () => {
          const result = mergeProps(mockStateProps, mockDispatchProps);
          expect(result.onClickNext).toBeA('function');
        });

        describe('onClickNext()', () => {
          it('should call dispatchProps.addSong when song is not empty', () => {
            mockStateProps.song = new SongState({ status: SongStatuses.BUFFERING });
            mergeProps(mockStateProps, mockDispatchProps).onClickNext();
            expect(mockDispatchProps.addSong).toHaveBeenCalled();
          });

          it('should not call dispatchProps.addSong when song is not empty', () => {
            mergeProps(mockStateProps, mockDispatchProps).onClickNext();
            expect(mockDispatchProps.addSong).toNotHaveBeenCalled();
          });

          it('should call dispatchProps.play', () => {
            mockStateProps.song = new SongState({ status: SongStatuses.BUFFERING });
            mergeProps(mockStateProps, mockDispatchProps).onClickNext();
            expect(mockDispatchProps.play).toHaveBeenCalled();
          });

          it('should call dispatchProps.removeSong', () => {
            mockStateProps.song = new SongState({ status: SongStatuses.BUFFERING });
            mergeProps(mockStateProps, mockDispatchProps).onClickNext();
            expect(mockDispatchProps.removeSong).toHaveBeenCalled();
          });
        });

        it('should return key onClickPause from dispatchProps.onClickPause', () => {
          expect(mergeProps(mockStateProps, mockDispatchProps).onClickPause)
            .toEqual(mockDispatchProps.onClickPause);
        });

        it('should return key onClickPlay from dispatchProps.onClickPlay', () => {
          expect(mergeProps(mockStateProps, mockDispatchProps).onClickPlay)
            .toEqual(mockDispatchProps.onClickPlay);
        });

        it('should return key status from stateProps.song.status', () => {
          expect(mergeProps(mockStateProps, mockDispatchProps).status)
            .toEqual(mockStateProps.song.status);
        });
      });

      it('should have class `.controls`', () => {
        expect(controls).toHaveClass('controls');
      });

      it('should render 2 <Button />s with class `.controls__button`', () => {
        const buttons = controls.find('Button.controls__button');
        expect(buttons.length).toEqual(2);
      });

      it('should add className from its props', () => {
        controls.setProps({ className: 'class' });
        expect(controls).toHaveClass('class');
      });

      it('should render 1 <Button /> when prop status is unknown', () => {
        controls.setProps({ status: '' });

        const buttons = controls.find('Button.controls__button');
        expect(buttons.length).toEqual(1);
      });

      it('should render 1 <Button /> when prop nextKey if falsey', () => {
        controls.setProps({ nextKey: '' });

        const buttons = controls.find('Button.controls__button');
        expect(buttons.length).toEqual(1);
      });

      it('should render a next Button when prop nextKey is truthy', () => {
        const nextButton = <Button className="controls__button" onClick={onClickNext}>Next</Button>;
        expect(controls.containsMatchingElement(nextButton)).toBe(true);
      });


      it('should render a buffering Button when prop status is BUFFERING', () => {
        const loadingButton =
          <Button className="controls__button controls__button--status">Loading</Button>;
        expect(controls.containsMatchingElement(loadingButton)).toBe(true);
      });

      it('should render an error Button when error', () => {
        controls.setProps({ status: 'ERROR' });

        const errorButton =
          <Button className="controls__button controls__button--status">Error</Button>;
        expect(controls.containsMatchingElement(errorButton)).toBe(true);
      });

      it('should render a play Button when paused', () => {
        controls.setProps({ status: 'PAUSED' });

        const playButton =
          <Button className="controls__button" onClick={onClickPlay}>Play</Button>;
        expect(controls.containsMatchingElement(playButton)).toBe(true);
      });

      it('should render a pause Button when playing', () => {
        controls.setProps({ status: 'PLAYING' });

        const pauseButton =
          <Button className="controls__button" onClick={onClickPause}>Pause</Button>;
        expect(controls.containsMatchingElement(pauseButton)).toBe(true);
      });

      it('should call onClickNext when next is clicked', () => {
        const nextButton = controls.children('Button').findWhere(node => node.contains('Next')).first();
        nextButton.simulate('click');

        expect(onClickNext).toHaveBeenCalled();
      });

      it('should call onClickPause when pause is clicked', () => {
        controls.setProps({ status: 'PLAYING' });

        const pauseButton = controls.children('Button').findWhere(node => node.contains('Pause')).first();
        pauseButton.simulate('click');

        expect(onClickPause).toHaveBeenCalled();
      });

      it('should call onClickPlay when play is clicked', () => {
        controls.setProps({ status: 'PAUSED' });

        const playButton = controls.children('Button').findWhere(node => node.contains('Play')).first();
        playButton.simulate('click');

        expect(onClickPlay).toHaveBeenCalled();
      });
    });
  });
});
