import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import App from './app/index';
import GuestPage from './pages/guest';
import HomePage from './pages/home';
import HostPage from './pages/host';
import RoomPage from './pages/room';

function Root({ store }) {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/guest" component={GuestPage} />
            <Route exact path="/host" component={HostPage} />
            <Route path="/:type/:id" component={RoomPage} />
          </Switch>
        </App>
      </BrowserRouter>
    </Provider>
  );
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
