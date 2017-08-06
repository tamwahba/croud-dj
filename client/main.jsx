import React from 'react';
import ReactDom from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import configureStore from './core/store';
import Root from './views/root';

import { watchCurrentUser } from './core/current-user';
import { watchFirebase } from './core/firebase';

import 'normalize.css';
import './views/styles/base.less';

const rootElement = document.getElementById('root');
const store = configureStore();

function render() {
  ReactDom.render(
    <AppContainer>
      <Root store={store} />
    </AppContainer>,
    rootElement);
}

store.dispatch(watchCurrentUser());
store.dispatch(watchFirebase());

if (module.hot) {
  module.hot.accept('./views/root', () => {
    render(require('./views/root').default);
  });
}

render(Root);
