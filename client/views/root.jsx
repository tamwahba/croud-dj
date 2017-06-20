import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import App from './app/index';
import HomePage from './pages/home';

function Root({ store }) {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App>
          <Route exact path="/" component={HomePage} />
        </App>
      </BrowserRouter>
    </Provider>
  );
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
