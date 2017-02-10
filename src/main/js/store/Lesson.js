// import { combineReducers } from 'redux';
import 'whatwg-fetch';

// ----------------
// DEFAULT STATE
//

export const defaultState = {
  question: [],
  correctAlt: '',
  randomOrderAlt: ['', '', '', ''],
  buttonStyles: ['default', 'default', 'default', 'default'],
  buttonDisabled: false,
  results: [],
  lessonLength: 0,
  // Things originally in SessionStorage
  totalAttempts: 0,
  
};

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export const RECEIVE_CSRF = 'RECEIVE_CSRF';
export const REQUEST_CSRF = 'REQUEST_CSRF';
export const RECEIVE_LOGGED_IN_USER = 'RECEIVE_LOGGED_IN_USER';
export const REQUEST_LOGGED_IN_USER = 'REQUEST_LOGGED_IN_USER';

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
  return function (dispatch) {
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

// -----------------
// PUBLIC ACTION CREATORS
//

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
export const reducer = (state, action) => {
  switch (action.type) {
    default:
      return state || defaultState;
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

// Not needed since we only have 1 reducer
// const randomStore = combineReducers({
//   reducer
// });
