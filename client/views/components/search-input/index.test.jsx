/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import TextInput from '../text-input';

import { mapDispatchToProps, UnconnectedSearchInput } from './index';

expect.extend(enzymify());

describe('views', () => {
  describe('components', () => {
    describe('search-input', () => {
      const search = expect.createSpy();
      const query = 'q';
      let searchSongs;

      beforeEach(() => {
        search.reset();
        searchSongs = shallow(<UnconnectedSearchInput search={search} query={query} />);
      });

      it('should be a TextInput', () => {
        expect(searchSongs).toBeA(TextInput);
      });

      it('should call search on input change', () => {
        searchSongs.simulate('change');
        expect(search).toHaveBeenCalled();
      });

      describe('mapDispatchToProps', () => {
        it('should return an object with a search function', () => {
          /* eslint-env browser */
          const fetchSpy = expect.spyOn(window, 'fetch');
          const dispatch = expect.createSpy();
          expect(mapDispatchToProps().search).toBeA('function');

          mapDispatchToProps(dispatch).search();
          expect(dispatch).toHaveBeenCalled();
          fetchSpy.restore();
        });
      });
    });
  });
});

