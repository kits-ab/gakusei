import 'whatwg-fetch';
// For temporary page management
import React from 'react';
import { browserHistory } from 'react-router';
import { push } from 'react-router-redux';

import Utility from './util/Utility';

// ----------------
// DEFAULT STATE
export const defaultState = {
  // Security
  loggedIn: false,
  loggedInUser: null,
  csrf: null
};

// -----------------
// ACTION CONSTANTS - Just used to differentiate the "actions"
export const RECEIVE_CSRF = 'RECEIVE_CSRF';
export const REQUEST_CSRF = 'REQUEST_CSRF';
export const RECEIVE_LOGGED_IN_USER = 'RECEIVE_LOGGED_IN_USER';
export const REQUEST_LOGGED_IN_USER = 'REQUEST_LOGGED_IN_USER';

// -----------------
// ACTION (CREATORS) - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.
export function receiveCSRF(csrf) {
  return {
    type: RECEIVE_CSRF,
    description: 'Fetching complete',
    csrf
  };
}

export function requestCSRF() {
  return {
    type: REQUEST_CSRF,
    description: 'Fetching now in progress'
  };
}

export function receiveLoggedInUser(user) {
  return {
    type: RECEIVE_LOGGED_IN_USER,
    description: 'Fetching complete',
    user
  };
}

export function requestLoggedInUser() {
  return {
    type: REQUEST_LOGGED_IN_USER,
    description: 'Fetching now in progress'
  };
}

export function fetchLoggedInUser() {
  return function (dispatch, getState) {
    dispatch(requestLoggedInUser());
    fetch('/username', { credentials: 'same-origin' })
      .then(response => response.text())
      .then(user => dispatch(receiveLoggedInUser(user)));
  };
}

export function fetchCSRF() {
  return function (dispatch) {
    dispatch(requestCSRF());

    const cookies = document.cookie.split('; ');
    const keys = cookies.map(cookie => cookie.split('=')[0]);
    const csrfValue = cookies[keys.indexOf('XSRF-TOKEN')].split('=')[1];

    dispatch(receiveCSRF(csrfValue));
    return csrfValue;
  };
}

export const actionCreators = {
  fetchCSRF,
  requestCSRF,
  receiveCSRF,
  fetchLoggedInUser,
  requestLoggedInUser,
  receiveLoggedInUser
};

// ----------------
// REDUCER - For a given state and action, returns the new state.
// To support time travel, this must not mutate the old state.
export const security = (state, action) => {
  switch (action.type) {
    default:
      return state || defaultState;
      // Security stuff
    case RECEIVE_CSRF:
      return {
        ...state,
        csrf: action.csrf
      };
    case REQUEST_CSRF:
      return {
        ...state,
        csrf: null
      };
    case REQUEST_LOGGED_IN_USER:
      return {
        ...state,
        csrf: null
      };
    case RECEIVE_LOGGED_IN_USER:
      return {
        ...state,
        loggedIn: true,
        loggedInUser: action.user
      };
  }
};

export const reducers = {
  security
};
