import { createStore, applyMiddleware, compose } from 'redux';
import { autoRehydrate } from 'redux-persist';
import { routerMiddleware } from 'react-router-redux';
import createBrowserHistory from 'history/createBrowserHistory';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './shared/reducers';

export const history = createBrowserHistory();

export function configureStore(initialState) {
  const windowIfDefined = typeof window === 'undefined' ? null : window;

  /* devcode: start */
  const devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension;
  /* devcode: end */

  const enhancer = compose(
    applyMiddleware(thunkMiddleware, routerMiddleware(history)),
    devToolsExtension ? devToolsExtension() : f => f,
    autoRehydrate()
  );

  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./shared/reducers', () => {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
}
