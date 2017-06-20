/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import App from './index';

expect.extend(enzymify());

describe('views', () => {
  describe('app', () => {
    it('should render an empty `main` when it has no children', () => {
      const app = shallow(<App />);
      expect(app).toHaveRendered(<main />);
    });
    it('should render its children in a `main`', () => {
      const children = <h1>hello</h1>;
      const app = shallow(<App>{children}</App>);
      expect(app).toHaveRendered(<main>{children}</main>);
    });
  });
});
