import { createStore, applyMiddleware, compose, combineReducers /* , GenericStoreEnhancer*/ } from 'redux';
import thunk from 'redux-thunk';
// import { routerReducer } from 'react-router-redux';
import * as Store from './store';

function buildRootReducer(allReducers) {
  // return combineReducers(Object.assign({}, allReducers, { routing: routerReducer }));
  return combineReducers(Object.assign({}, allReducers, { routing: 'test' }));
}

export default function configureStore(initialState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
  const windowIfDefined = typeof window === 'undefined' ? null : window;
    // If devTools is installed, connect to it
  const devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension;
  const createStoreWithMiddleware = compose(
        applyMiddleware(thunk),
        devToolsExtension ? devToolsExtension() : f => f
    )(createStore);
    // Combine all reducers and instantiate the app-wide store instance
  const allReducers = buildRootReducer(Store.reducers);
  // const allReducers = Store.reducers;
  const store = createStoreWithMiddleware(allReducers, initialState);
    // Enable Webpack hot module replacement for reducers
//   if (module.hot) {
//     module.hot.accept('./store', () => {
//       const nextRootReducer = require('./store');
//       store.replaceReducer(buildRootReducer(nextRootReducer.reducers));
//     });
//   }
  return store;
}

