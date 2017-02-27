import 'whatwg-fetch';
import { push } from 'react-router-redux';
import React from 'react';
import Utility from '../../shared/util/Utility';

// ----------------
// DEFAULT STATE
export const defaultState = {
  // Security
  loggedIn: false,
  loggedInUser: '',
  currentPageName: null,
  currentPage: null
};

// ----------------
// PROPTYPES
export const propTypes = {
  loggedIn: React.PropTypes.bool.isRequired,
  loggedInUser: React.PropTypes.string.isRequired
};

// -----------------
// ACTION CONSTANTS - Just used to differentiate the "actions"
export const SET_PAGE = 'SET_PAGE';
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

export function setPageByName(pageName, query = null) {
  return function (dispatch) {
    dispatch(push({
      pathname: `${pageName}`,
      query
    }));

    dispatch({
      type: SET_PAGE,
      description: 'Set name of current page, for supporting deprecated functions',
      currentPageName: pageName
    });
  };
}

export function receiveLoggedInUser(user) {
  return function (dispatch) {
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

export function requestUserLogout(redirectUrl, csrf) {
  return function (dispatch) {
    fetch('/logout',
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'X-XSRF-TOKEN': csrf
        }
      })
    .then((response) => {
      if (response.status === 200) {
        dispatch(receiveLoggedInStatus(false));
        dispatch(setPageByName(redirectUrl || '/'));
      }
    });
  };
}

export function requestUserLogin(data, redirectUrl) {
  return function (dispatch) {
    const formBody = (typeof data === 'string' ? data : Utility.getFormData(data).join('&'));

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
        dispatch(fetchLoggedInUser());
        dispatch(setPageByName(redirectUrl || '/'));
      }
    });
  };
}

export function requestUserRegister(data, redirectUrl) {
  return function (dispatch) {
    const formBody = (typeof data === 'string' ? data : Utility.getFormData(data).join('&'));

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
        // Registration succeeded, but no autologin

        dispatch(requestUserLogin(formBody, redirectUrl));
      } else if (response.status === 422) {
        // User already exists
      }
    });
  };
}

export const actionCreators = {
  fetchLoggedInUser,
  requestLoggedInUser,
  receiveLoggedInUser,
  requestUserLogout,
  requestUserLogin,
  requestUserRegister,
  setPageByName
};

// ----------------
// REDUCER - For a given state and action, returns the new state.
// To support time travel, this must not mutate the old state.
export const security = (state, action) => {
  switch (action.type) {
    default:
      return state || defaultState;
    case SET_PAGE:
      return {
        ...state,
        currentPageName: action.currentPageName
      };
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
