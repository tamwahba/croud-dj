/* eslint-env mocha */
import expect from 'expect';
import enzymify from 'expect-enzyme';
import { shallow } from 'enzyme';
import Immutable from 'immutable';
import React from 'react';
import { Link } from 'react-router-dom';

import LinkList from './index';

expect.extend(enzymify());

describe('views', () => {
  describe('components', () => {
    describe('link-list', () => {
      const link1 = { url: 'url1', text: 'text2' };
      const link2 = { url: 'url2', text: 'text2' };
      const links = Immutable.fromJS([link1, link2]);
      const list = shallow(<LinkList links={links} />);

      it('should be an unordered list', () => {
        expect(list).toBeAn('ul');
      });

      it('should map prop links to list items', () => {
        const listItems = list.find('li');

        expect(listItems.length).toEqual(2);

        expect(listItems.first()).toBeA('li');
        expect(listItems.last()).toBeA('li');
      });

      it('should have <Link />s in each list item', () => {
        const listItems = list.find('li');
        const listItem1 = listItems.first().shallow();
        const listItem2 = listItems.last().shallow();

        expect(listItem1).toContain(Link);
        expect(listItem2).toContain(Link);
      });
    });
  });
});
