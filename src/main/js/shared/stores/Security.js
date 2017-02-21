import 'whatwg-fetch';
import React from 'react';

// ----------------
// DEFAULT STATE
export const defaultState = {
  // Security
  loggedIn: false,
  loggedInUser: ''
};

// ----------------
// PROPTYPES
export const propTypes = {
  loggedIn: React.PropTypes.bool.isRequired,
  loggedInUser: React.PropTypes.string.isRequired
};

// -----------------
// ACTION CONSTANTS - Just used to differentiate the "actions"
export const RECEIVE_LOGGED_IN_USER = 'RECEIVE_LOGGED_IN_USER';
export const REQUEST_LOGGED_IN_USER = 'REQUEST_LOGGED_IN_USER';
export const RECEIVE_LOGGED_IN_STATUS = 'RECEIVE_LOGGED_IN_STATUS';

// -----------------
// ACTION (CREATORS) - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.
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
  return function (dispatch) {
    dispatch(requestLoggedInUser());

    fetch('/username', { credentials: 'same-origin' })
      .then((response) => {
        if (response.status === 200) {
          response.text().then((text) => {
            const data = JSON.parse(text);
            dispatch(receiveLoggedInUser(data.username));
            dispatch(receiveLoggedInStatus(data.loggedIn));
          });
        } else {
          // 500 error etc.
          dispatch(receiveLoggedInUser(''));
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
      }
    });
  };
}

export const actionCreators = {
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
