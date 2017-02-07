/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
// import { createStore } from 'redux';
import { Provider /* , connect*/ } from 'react-redux';

import App from './components/App';
import configureStore from './configureStore';

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState;
const store = configureStore(initialState);
// const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('index_root'));
