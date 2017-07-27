import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import App from './app/index';
import HomePage from './pages/home';
import HostPage from './pages/host';

function Root({ store }) {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App>
          <div>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/host/:room" component={HostPage} />
          </div>
        </App>
      </BrowserRouter>
    </Provider>
  );
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
