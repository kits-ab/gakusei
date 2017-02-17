import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { routerReducer, routerMiddleware, push } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunkMiddleware from 'redux-thunk';
import * as Store from './Store';
import * as Test from './Test';

function buildRootReducer(allReducers) {
  // debugger;
  const hello = combineReducers(Object.assign({}, allReducers, { routing: routerReducer }));
  // debugger;
  return hello;
  // return combineReducers(Object.assign({}, allReducers, { routing: 'test' }));
}

export default function configureStore(initialState) {
  // Build middleware which allows action creators to generate functions and not only objects
  const windowIfDefined = typeof window === 'undefined' ? null : window;
  // If devTools is installed, connect to it
  const devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension;

  const createStoreWithMiddleware = compose(
        applyMiddleware(thunkMiddleware, routerMiddleware(browserHistory)),
        devToolsExtension ? devToolsExtension() : f => f
    )(createStore);

  const testReducer = Test.reducers;
  const storeReducer = Store.reducers;

  const combination = Object.assign({},
  testReducer,
  storeReducer);

  // debugger;
  // Combine all reducers and instantiate the app-wide store instance
  const allReducers = buildRootReducer(combination);

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

