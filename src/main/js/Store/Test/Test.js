export const SET_TEST = 'SET_TEST';

export const RECEIVE_LOGGED_IN_STATUS = 'RECEIVE_LOGGED_IN_STATUS';
export const RECEIVE_CSRF = 'RECEIVE_CSRF';
export const REQUEST_CSRF = 'REQUEST_CSRF';
export const RECEIVE_LOGGED_IN_USER = 'RECEIVE_LOGGED_IN_USER';
export const REQUEST_LOGGED_IN_USER = 'REQUEST_LOGGED_IN_USER';

export const defaultState = {
  atest: 'test',
  // Security
  loggedIn: false,
  loggedInUser: null,
  csrf: null
};

export function doAnotherTest(atest) {
  return function (dispatch, getState) {
    dispatch({
      type: SET_TEST,
      description: 'We do another test',
      atest: `${atest}MODIFIED!`
    });
  };
}

export function doThirdTest() {
  return function (dispatch, getState) {
    const state = getState().areducer;
    const state2 = getState().reducer;

    dispatch({
      type: SET_TEST,
      description: 'We do another test',
      atest: `${getState.atest}MODIFIED WITH: ${getState.questionType}`
    });
  };
}

export function doATest(atest) {
  return {
    type: SET_TEST,
    description: 'We do a test',
    atest
  };
}

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

export function receiveLoggedInStatus(loggedIn) {
  return {
    type: RECEIVE_LOGGED_IN_STATUS,
    description: 'Receive status on whether we are logged in or not',
    loggedIn
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
      .then(response => response.json())
      .then((usernameInfo) => {
        dispatch(receiveLoggedInUser(usernameInfo.username));
        dispatch(receiveLoggedInStatus(usernameInfo.loggedIn));
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

export function requestUserRegister(data) {
  return function (dispatch, getState) {
    const formBody = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
    const navigationState = getState().Main;

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
        dispatch(receiveLoggedInStatus(true));
        dispatch(receiveLoggedInUser(data.username));
        dispatch(navigationState.setPageByName('home'));
      } else if (response.status === 422) {
        // User already exists
      }
    });
  };
}

export function Testing() {
  return {
    type: REQUEST_LOGGED_IN_USER,
    description: 'Fetching now in progress'
  };
}

export function requestUserLogin(data) {
  return function (dispatch, getState) {
    const formBody = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
    const navigationState = getState().Main;
    debugger;
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
        dispatch(navigationState.setPageByName('home'));
      }
    });
  };
}


export const Test = (state, action) => {
  switch (action.type) {
    default:
      return state || defaultState;
    case SET_TEST:
      return {
        ...state,
        atest: `${action.atest}1`
      };
    case RECEIVE_CSRF:
      return {
        ...state,
        csrf: action.csrf
      };
    case RECEIVE_LOGGED_IN_STATUS:
      return {
        ...state,
        loggedIn: action.loggedIn
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

export const actionCreators = {
  doATest,
  doAnotherTest,
  doThirdTest,
  fetchCSRF,
  requestCSRF,
  receiveCSRF,
  fetchLoggedInUser,
  requestLoggedInUser,
  receiveLoggedInUser,
  requestUserLogin,
  requestUserRegister,
  Testing
};

export const reducers = {
  Test
};
