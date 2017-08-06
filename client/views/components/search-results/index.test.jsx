/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import { List } from 'immutable';
import React from 'react';

import { SongState } from '../../../core/song';

import Button from '../button';
import SongCard from '../song-card';
import SongList from '../song-list';

import { mapDispatchToProps, mergeProps, UnconnectedSearchResults } from './index';

expect.extend(enzymify());

describe('views', () => {
  describe('components', () => {
    describe('search-results', () => {
      const addToQueue = expect.createSpy();
      const clearResults = expect.createSpy();
      const isLoading = false;
      const results = new List([new SongState()]);
      let searchResults;

      beforeEach(() => {
        searchResults = shallow(<UnconnectedSearchResults
          addToQueue={addToQueue}
          clearResults={clearResults}
          isLoading={isLoading}
          results={results}
        />);
      });

      it('should be a SongList if prop isLoading is false', () => {
        expect(searchResults).toBeA(SongList);
      });

      it('should be a span if prop isLoading is true', () => {
        searchResults.setProps({ isLoading: true });
        expect(searchResults).toBeA('span');
      });

      it('should call prop addToQueue and prop clearResults when accessory Button is clicked', () => {
        expect(searchResults).toContain(SongList);
        const list = searchResults.find(SongList).shallow();

        expect(list).toContain(SongCard);
        const card = list.find(SongCard).shallow();

        expect(card).toContain(Button);
        const button = card.find(Button);

        expect(addToQueue).toNotHaveBeenCalled();
        expect(clearResults).toNotHaveBeenCalled();

        button.simulate('click', {
          preventDefault: () => null,
        });

        expect(addToQueue).toHaveBeenCalled();
        expect(clearResults).toHaveBeenCalled();
      });

      describe('mapDispatchToProps', () => {
        const dispatch = expect.createSpy();

        beforeEach(() => {
          dispatch.reset();
        });

        it('should return an object with an addToQueue curried function', () => {
          const add = mapDispatchToProps(dispatch).addToQueue;
          expect(add).toBeA('function');
          const addReturn = add();

          expect(addReturn).toBeA('function');

          addReturn(new SongState());

          expect(dispatch).toHaveBeenCalled();
        });

        it('should return an object with a clearResults function', () => {
          expect(mapDispatchToProps(dispatch).clearResults).toBeA('function');

          mapDispatchToProps(dispatch).clearResults();

          expect(dispatch).toHaveBeenCalled();
        });
      });

      describe('mergeProps', () => {
        const mockDispatchProps = {
          addToQueue: expect.createSpy(),
          clearResults: expect.createSpy(),
        };

        const mockStateProps = {
          isLoading: true,
          results: new List(),
          room: {
            name: 'name',
          },
        };

        beforeEach(() => {
          mockDispatchProps.addToQueue.reset();
          mockDispatchProps.clearResults.reset();
        });

        it('should return object with addToQueue uncurried dispatchProps.addToQueue function', () => {
          expect(mergeProps(mockStateProps, mockDispatchProps).addToQueue)
            .toEqual(mockDispatchProps.addToQueue(mockStateProps.room.name));
        });

        it('should return object with clearResults from dispatchProps.clearResults', () => {
          expect(mergeProps(mockStateProps, mockDispatchProps).clearResults)
            .toEqual(mockDispatchProps.clearResults);
        });

        it('should return object with isLoading from stateProps.isLoading', () => {
          expect(mergeProps(mockStateProps, mockDispatchProps).isLoading)
            .toEqual(mockStateProps.isLoading);
        });

        it('should return object with results from stateProps.results', () => {
          expect(mergeProps(mockStateProps, mockDispatchProps).results)
            .toEqual(mockStateProps.results);
        });
      });
    });
  });
});
