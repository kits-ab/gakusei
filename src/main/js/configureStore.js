import { createStore, applyMiddleware, compose } from 'redux';
import { autoRehydrate } from 'redux-persist';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunkMiddleware from 'redux-thunk';

import devOnly from './shared/util/devOnly';
import rootReducer from './shared/reducers';

export default function configureStore(initialState) {
  const windowIfDefined = typeof window === 'undefined' ? null : window;
  const devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension;

  const devEnhancers = [];
  devEnhancers.push(devToolsExtension ? devToolsExtension() : f => f);

  const enhancer = compose(
        applyMiddleware(thunkMiddleware, routerMiddleware(browserHistory)),
        devOnly(devToolsExtension ? devToolsExtension() : f => f),
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

