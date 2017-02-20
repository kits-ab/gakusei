/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, Router, Route, IndexRedirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './configureStore';

import appScreen from './screens/app';
import aboutScreen from './screens/app/screens/about';
import translateScreen from './screens/app/screens/translate';
import listsScreen from './screens/app/screens/lists';
import homeScreen from './screens/app/screens/home';
import finishScreen from './screens/app/screens/finish';
import profileScreen from './screens/app/screens/profile';

// New
import playScreen from './screens/app/screens/play';
import selectScreen from './screens/app/screens/select';

// Get the application-wide store instance, prepopulating with state from the server where available.
// ! Don't have server-rendering yet, might add later
const initialState = window.initialReduxState;
const store = configureStore(initialState);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route name="Gakusei" path="/" component={appScreen}>
        <IndexRedirect to="home" />
        <Route path="/home" component={homeScreen} />
        <Route path="/play/:type" component={playScreen} />
        <Route path="/select/:type" component={selectScreen} />
        <Route path="/translate" component={translateScreen} />
        <Route path="/lists" component={listsScreen} />
        <Route path="/finish/:type" component={finishScreen} />
        <Route path="/profile" component={profileScreen} />
        <Route path="/about" component={aboutScreen} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('index_root'));
