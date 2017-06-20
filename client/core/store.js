import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

export default function configureStore() {
  let middleware = applyMiddleware(thunk);

  if (process.env.NODE_ENV !== 'production') {
    const devtoolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;
    if (typeof devtoolsExtension === 'function') {
      middleware = compose(middleware, devtoolsExtension());
    }
  }

  const store = createStore(reducers, middleware);

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers').default);
    });
  }

  return store;
};
