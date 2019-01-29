import 'whatwg-fetch';
import { push } from 'react-router-redux';
import { REHYDRATE } from 'redux-persist/constants';
import Utility from '../../shared/util/Utility';
import { translate, Trans } from 'react-i18next';
import i18n from 'i18next';
import { addStarredLesson } from './Lessons';

// ----------------
// DEFAULT STATE
export const defaultState = {
  projectVersion: process.env.PROJECT_VERSION,
  purgeNeeded: false,

  // Security
  loginInProgress: false,
  registerInProgress: false,
  authSuccess: null,
  authResponse: null,
  loggedIn: false,
  loggedInUser: '',
  currentPageName: '',
  currentPage: null,
  redirectUrl: null,
  announcement: [],
  displayAnnouncement: true
};

// ----------------
// PROPTYPES
export const propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.string.isRequired
};

// -----------------
// ACTION CONSTANTS - Just used to differentiate the "actions"
export const SET_PAGE = 'SET_PAGE';
export const RECEIVE_LOGGED_IN_USER = 'RECEIVE_LOGGED_IN_USER';
export const REQUEST_LOGGED_IN_USER = 'REQUEST_LOGGED_IN_USER';
export const RECEIVE_LOGGED_IN_STATUS = 'RECEIVE_LOGGED_IN_STATUS';
export const RECEIVE_AUTH_RESPONSE = 'RECEIVE_AUTH_RESPONSE';
export const SET_LOGGING_IN = 'SET_LOGGING_IN';
export const SET_REGISTERING = 'SET_REGISTERING';
export const CLEAR_AUTH_RESPONSE = 'CLEAR_AUTH_RESPONSE';
export const SET_REDIRECT_URL = 'SET_REDIRECT_URL';
export const RECIEVE_ANNOUNCEMENT = 'RECIEVE_ANNOUNCEMENT';
export const SET_DISPLAY_ANNOUNCEMENT = 'SET_DISPLAY_ANNOUNCEMENT';

// -----------------
// ACTION (CREATORS) - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.
export function recieveAnnouncement(announcement) {
  return {
    type: RECIEVE_ANNOUNCEMENT,
    announcement
  };
}
export function disableAnnouncement(id) {
  return {
    type: SET_DISPLAY_ANNOUNCEMENT,
    id
  };
}
export function fetchAnnouncement() {
  return function(dispatch) {
    return fetch(`/api/announcement`)
      .then(response => response.json())
      .then(result => result.map(a => (a = { ...a, visible: true })))
      .then(endResult => dispatch(recieveAnnouncement(endResult)));
  };
}

export function setRedirectUrl(url) {
  return {
    type: SET_REDIRECT_URL,
    url
  };
}

export function clearAuthResponse() {
  return {
    type: CLEAR_AUTH_RESPONSE
  };
}

export function receiveAuthResponse(success, response) {
  return {
    type: RECEIVE_AUTH_RESPONSE,
    success,
    response
  };
}

export function setLoggingIn(status = true) {
  return function(dispatch) {
    dispatch(clearAuthResponse());
    dispatch({
      type: SET_LOGGING_IN,
      status
    });
  };
}

export function setRegistering(status = true) {
  return {
    type: SET_REGISTERING,
    status
  };
}

export function receiveLoggedInStatus(loggedIn) {
  return function(dispatch) {
    if (!loggedIn) {
      dispatch({
        type: RECEIVE_LOGGED_IN_USER,
        description: 'Get status on whether we are logged in or not',
        loggedInUser: ''
      });
    }

    dispatch({
      type: RECEIVE_LOGGED_IN_STATUS,
      description: 'Get status on whether we are logged in or not',
      loggedIn
    });
  };
}

export function setPageByName(pageName, query = null) {
  return function(dispatch) {
    dispatch(
      push({
        pathname: `${pageName}`,
        query
      })
    );

    dispatch({
      type: SET_PAGE,
      description: 'Set name of current page, for supporting deprecated functions',
      currentPageName: pageName
    });
  };
}

export function receiveLoggedInUser(user) {
  return function(dispatch) {
    dispatch({
      type: RECEIVE_LOGGED_IN_USER,
      description: 'Fetching complete',
      user
    });

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
  return function(dispatch) {
    dispatch(requestLoggedInUser());

    return new Promise(resolve => {
      fetch('/username', { credentials: 'same-origin' }).then(response => {
        if (response.status === 200) {
          response.text().then(text => {
            const data = JSON.parse(text);
            dispatch(receiveLoggedInUser(data.username));
            dispatch(receiveLoggedInStatus(data.loggedIn));
            resolve();
          });
        } else {
          // 500 error etc.
          dispatch(receiveLoggedInUser(''));
          resolve();
        }
      });
    });
  };
}

export function requestUserLogout(redirectUrl, csrf) {
  return function(dispatch, getState) {
    const routing = getState().routing;

    fetch('/logout', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'X-XSRF-TOKEN': csrf || ''
      }
    }).then(response => {
      if (response.status === 200 || response.status === 204) {
        dispatch(receiveLoggedInStatus(false));
        dispatch(clearAuthResponse());
        dispatch(setPageByName(redirectUrl || routing.locationBeforeTransitions.pathname || '/'));
      }
    });
  };
}
export function logLoginEvent(username) {
  Utility.logEvent('login', 'login', true, null, username, null, null, true);
}

export function requestUserLogin(data, redirectUrl) {
  return function(dispatch, getState) {
    const formBody = typeof data === 'string' ? data : Utility.getFormData(data).join('&');

    dispatch(setLoggingIn());

    try {
      fetch('/auth', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/xhtml+xml, application/xml, text/plain, text/html, */*',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        body: formBody
      }).then(response => {
        switch (response.status) {
          case 403:
            if (i18n.language === 'se') {
              dispatch(receiveAuthResponse(false, 'Felaktiga uppgifter, vänligen kontrollera formuläret.'));
            } else if (i18n.language === 'jp') {
              dispatch(receiveAuthResponse(false, '情報が正しくない場合は、フォームを確認してください。'));
            } else {
              dispatch(receiveAuthResponse(false, 'Incorrect information, please check the form.'));
            }
            break;
          case 200:
            if (i18n.language === 'se') {
              dispatch(receiveAuthResponse(true, 'Inloggad, tar dig vidare..'));
            } else if (i18n.language === 'jp') {
              dispatch(receiveAuthResponse(true, 'ログイン'));
            } else {
              dispatch(receiveAuthResponse(true, 'Logging in..'));
            }
            dispatch(setRedirectUrl(null));
            dispatch(fetchLoggedInUser()).then(() => {
              dispatch(setPageByName(redirectUrl || '/'));
              dispatch(logLoginEvent(getState().security.loggedInUser));
              //TODO: FIX ADD STARRED LESSON BELOOOOWWWW
            });
            fetch('/api/checkNewUser', {
              method: 'post',
              credentials: 'same-origin',
              body: formBody.split('&')[0].split('=')[1]
            }).then(response => {
              console.log('status: ' + response.status);
              if (response.status === 200) {
                console.log('Adding lessons to favourite');
                addStarredLesson('GENKI 01', 'guess');
                addStarredLesson('KLL 01', 'kanji');
              }
            });
            break;
          default:
            throw new Error();
        }
      });
    } catch (err) {
      if (i18n.language === 'se') {
        dispatch(receiveAuthResponse(false, 'Tekniskt fel. Vänligen försök igen senare.'));
      } else if (i18n.language === 'jp') {
        dispatch(receiveAuthResponse(false, '技術的なエラー。 後でもう一度お試しください。'));
      } else {
        dispatch(receiveAuthResponse(false, 'Technical issue. Please try again later.'));
      }
    } finally {
      dispatch(setLoggingIn(false));
    }
  };
}

export function requestUserRegister(data, redirectUrl) {
  return function(dispatch) {
    const formBody = typeof data === 'string' ? data : Utility.getFormData(data).join('&');

    try {
      dispatch(setRegistering());

      fetch('/registeruser', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/xhtml+xml, application/xml, text/plain, text/html, */*',
          'Content-Type': 'text/plain; charset=utf-8'
        },
        body: formBody
      }).then(response => {
        switch (response.status) {
          case 406:
            if (i18n.language === 'se') {
              dispatch(receiveAuthResponse(false, 'Användarnamnet måste vara mellan 2 och 32 tecken.'));
            } else if (i18n.language === 'jp') {
              dispatch(receiveAuthResponse(false, 'ユーザー名は2〜32文字でなければなりません。'));
            } else {
              dispatch(receiveAuthResponse(false, 'The username must be between 2 and 32 characters.'));
            }

            break;
          case 422:
            if (i18n.language === 'se') {
              dispatch(receiveAuthResponse(false, 'Användarnamnet finns tyvärr redan, prova ett annat.'));
            } else if (i18n.language === 'jp') {
              dispatch(receiveAuthResponse(false, 'ユーザー名はすでに存在し、別のユーザー名を試してください。'));
            } else {
              dispatch(receiveAuthResponse(false, 'The username already exists, try another.'));
            }

            break;
          case 201:
            if (i18n.language === 'se') {
              dispatch(receiveAuthResponse(true, 'Registreringen lyckades, loggar in..'));
            } else if (i18n.language === 'jp') {
              dispatch(receiveAuthResponse(true, '登録は成功し、ログインしました。'));
            } else {
              dispatch(receiveAuthResponse(true, 'The registration was successful, logging in.'));
            }

            setTimeout(() => dispatch(requestUserLogin(formBody, redirectUrl)), 1500);
            break;
          default:
            dispatch(fetchLoggedInUser());
            throw new Error();
        }

        dispatch(setRegistering(false));
      });
    } catch (err) {
      if (i18n.language === 'se') {
        dispatch(receiveAuthResponse(false, 'Tekniskt fel. Vänligen försök igen senare.'));
      } else if (i18n.language === 'jp') {
        dispatch(receiveAuthResponse(false, '技術的なエラー。 後でもう一度お試しください。'));
      } else {
        dispatch(receiveAuthResponse(false, 'Technical issue. Please try again later.'));
      }
      dispatch(setRegistering(false));
    }
  };
}

export function reloadCurrentRoute() {
  return function(dispatch, getState) {
    const routing = getState().routing;

    dispatch(setPageByName(routing.locationBeforeTransitions.pathname));
  };
}

export function verifyUserLoggedIn() {
  return function(dispatch, getState) {
    const securityState = getState().security;

    dispatch(fetchLoggedInUser()).then(() => {
      if (!securityState.loggedIn) {
        dispatch(reloadCurrentRoute());
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
  setPageByName,
  reloadCurrentRoute,
  verifyUserLoggedIn,
  clearAuthResponse,
  setRedirectUrl,
  fetchAnnouncement,
  disableAnnouncement
};

// ----------------
// REDUCER - For a given state and action, returns the new state.
// To support time travel, this must not mutate the old state.
export function security(state = defaultState, action) {
  // Special case of redux-persist
  if (action.type === REHYDRATE) {
    const incoming = action.payload.security;

    if (incoming) {
      return {
        ...state,
        loggedIn: incoming.loggedIn,
        loggedInUser: incoming.loggedInUser,
        purgeNeeded: incoming.projectVersion !== state.projectVersion
      };
    }
    return state;
  }

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
    case RECEIVE_AUTH_RESPONSE:
      return {
        ...state,
        authSuccess: action.success,
        authResponse: action.response
      };
    case SET_LOGGING_IN:
      return {
        ...state,
        loginInProgress: action.status
      };
    case SET_REGISTERING:
      return {
        ...state,
        registerInProgress: action.status
      };
    case CLEAR_AUTH_RESPONSE:
      return {
        ...state,
        authSuccess: null,
        authResponse: null
      };
    case SET_REDIRECT_URL:
      return {
        ...state,
        redirectUrl: action.url
      };
    case RECIEVE_ANNOUNCEMENT:
      return {
        ...state,
        announcement: action.announcement
      };
    case SET_DISPLAY_ANNOUNCEMENT:
      return {
        ...state,
        announcement: state.announcement.map(a => (a.id === action.id ? { ...a, visible: false } : a))
      };
  }
}

export const reducers = {
  security
};
