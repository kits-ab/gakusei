import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as Store from './store';

function buildRootReducer(allReducers) {
  // return combineReducers(Object.assign({}, allReducers, { routing: routerReducer }));
  return combineReducers(Object.assign({}, allReducers, { routing: 'test' }));
}

export default function configureStore(initialState) {
  // Build middleware which allows action creators to generate functions and not only objects
  const windowIfDefined = typeof window === 'undefined' ? null : window;
  // If devTools is installed, connect to it
  const devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension;

  const createStoreWithMiddleware = compose(
        applyMiddleware(thunkMiddleware),
        devToolsExtension ? devToolsExtension() : f => f
    )(createStore);

  // Combine all reducers and instantiate the app-wide store instance
  const allReducers = buildRootReducer(Store.reducers);

  const store = createStoreWithMiddleware(allReducers, initialState);
  // Enable Webpack hot module replacement for reducers.. But we're not using webpack
  //   if (module.hot) {
  //     module.hot.accept('./store', () => {
  //       const nextRootReducer = require('./store');
  //       store.replaceReducer(buildRootReducer(nextRootReducer.reducers));
  //     });
  //   }
  return store;
}

