/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import Vote from './index';

expect.extend(enzymify);

describe('views', () => {
  describe('components', () => {
    describe('vote', () => {
      const className = 'class';
      const id = 'id';
      const downVote = expect.createSpy();
      const upVote = expect.createSpy();
      const count = 0;

      let vote;

      beforeEach(() => {
        downVote.reset();
        upVote.reset();

        vote = shallow(<Vote
          className={className}
          id={id}
          onDownVote={downVote}
          onUpVote={upVote}
          count={count}
        />);
      });

      it('should have class `.vote`', () => {
        expect(vote).toHaveClass('vote');
      });

      it('should have 2 elements `Button.vote__button`', () => {
        expect(vote.find('Button.vote__button').length).toEqual(2);
      });

      it('should have element `span.vote__count`', () => {
        expect(vote).toContain('span.vote__count');
      });

      it('should have class from prop className', () => {
        expect(vote).toHaveClass(className);
      });

      it('should call prop onDownVote when clicked', () => {
        vote.find('Button.vote__button').last().simulate('click', { preventDefault: () => null });

        expect(downVote).toHaveBeenCalledWith(id);
      });

      it('should call prop onUpVote when clicked', () => {
        vote.find('Button.vote__button').first().simulate('click', { preventDefault: () => null });

        expect(upVote).toHaveBeenCalledWith(id);
      });
    });
  });
});
