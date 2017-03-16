import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunkMiddleware from 'redux-thunk';

// Our reducers
import rootReducer from './shared/reducers';
// import * as Test from './shared/reducers/Test';
// import * as Lessons from './shared/reducers/Lessons';
// import * as Statistics from './shared/reducers/Statistics';
// import * as Security from './shared/reducers/Security';

// function buildRootReducer(allReducers) {
//   return combineReducers(Object.assign({}, allReducers, { routing: routerReducer }));
// }

export default function configureStore(initialState, rehydratedDone) {
  const windowIfDefined = typeof window === 'undefined' ? null : window;
  const devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension;

  const enhancer = compose(
        applyMiddleware(thunkMiddleware, routerMiddleware(browserHistory)),
        devToolsExtension ? devToolsExtension() : f => f,
        autoRehydrate()
    );

  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./shared/reducers', () => {
      const nextRootReducer = require('./shared/reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

// export function configureStoreOld(initialState) {
//   // Build middleware which allows action creators to generate functions and not only objects
//   const windowIfDefined = typeof window === 'undefined' ? null : window;
//   // If devTools is installed, connect to it
//   const devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension;

//   const createStoreWithMiddleware = compose(
//         applyMiddleware(thunkMiddleware, routerMiddleware(browserHistory)),
//         devToolsExtension ? devToolsExtension() : f => f,
//         autoRehydrate()
//     )(createStore);

//   // Combine all reducers and instantiate the app-wide store instance
//   const allReducers = buildRootReducer(Object.assign({},
//    Test.reducers,
//    Statistics.reducers,
//    Lessons.reducers,
//    Security.reducers));

//   const store = createStoreWithMiddleware(allReducers/* , initialState*/);
//   persistStore(store);

//   // if (module.hot) {
//   //   // Enable Webpack hot module replacement for reducers
//   //   module.hot.accept('shared/reducers/', () => {
//   //     const nextTest = require('./shared/reducers/Test');
//   // //     const nextLessons = require('./shared/reducers/Lessons/index').default;
//   // //     const nextStatistics = require('./shared/reducers/Statistics/index').default;
//   // //     const nextSecurity = require('./shared/reducers/Security/index').default;
//   //     store.replaceReducer(nextTest);
//   // //     store.replaceReducer(nextLessons);
//   // //     store.replaceReducer(nextStatistics);
//   // //     store.replaceReducer(nextSecurity);
//   //   });
//   // }

//   // Enable Webpack hot module replacement for reducers.. But we're not using webpack.. yet! - William
//   //   if (module.hot) {
//   //     module.hot.accept('./store', () => {
//   //       const nextRootReducer = require('./store');
//   //       store.replaceReducer(buildRootReducer(nextRootReducer.reducers));
//   //     });
//   //   }
//   return store;
// }

