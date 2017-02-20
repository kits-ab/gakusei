import 'whatwg-fetch';
// For temporary page management
// import React from 'react';
// import { browserHistory } from 'react-router';
// import { push } from 'react-router-redux';

// import Utility from '../../shared/util/Utility';

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
export const RECEIVE_LOGGED_IN_STATUS = 'RECEIVE_LOGGED_IN_STATUS';

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

export function receiveLoggedInStatus(loggedIn) {
  return {
    type: RECEIVE_LOGGED_IN_STATUS,
    description: 'Get status on whether we are logged in or not',
    loggedIn
  };
}

export function receiveLoggedInUser(user) {
  return function (dispatch, getState) {
    dispatch({
      type: RECEIVE_LOGGED_IN_USER,
      description: 'Fetching complete',
      user });

    dispatch(receiveLoggedInStatus(!!user));
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
      .then((response) => {
        if (response.status === 200) {
          dispatch(receiveLoggedInUser(response.text()));
        } else {
          // 500 error etc.
          dispatch(receiveLoggedInUser(null));
        }
      });
  };
}

export function requestUserRegister(data) {
  return function (dispatch, getState) {
    const formBody = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');

    fetch('/registeruser', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/xhtml+xml, application/xml, text/plain, text/html, */*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: formBody
    }).then((response) => {
      if (response.status === 201) {
        // Registration succeeded
        dispatch(receiveLoggedInUser(data.username));
        // dispatch(setPageByName('home'));
      } else if (response.status === 422) {
        // User already exists
      }
    });
  };
}

export function requestUserLogin(data) {
  return function (dispatch, getState) {
    const formBody = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');

    fetch('/auth', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/xhtml+xml, application/xml, text/plain, text/html, */*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: formBody
    })
    .then((response) => {
      if (response.status === 200) {
        dispatch(receiveLoggedInStatus(true));
        dispatch(receiveLoggedInUser(data.username));
        // dispatch(setPageByName('home'));
      }
    });
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
  receiveLoggedInUser,
  requestUserLogin,
  requestUserRegister
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
        loggedInUser: action.user
      };
    case RECEIVE_LOGGED_IN_STATUS:
      return {
        ...state,
        loggedIn: action.loggedIn
      };
  }
};

export const reducers = {
  security
};
