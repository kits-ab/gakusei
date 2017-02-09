// import { combineReducers } from 'redux';
import 'whatwg-fetch';

// ----------------
// DEFAULT STATE
//

export const defaultState = {
  successRate: 0,
  lessonSuccessRate: 0,
  lessonSuccessRateMessage: '',
  correctAttempts: 0,
  totalAttempts: 0,
  requestingSuccessRate: false,
  requestSuccessRateStatus: null,
  requestSuccessRateResponse: null,
  requestSuccessRateLastReceived: null
};

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export const RECEIVE_USER_SUCCESS_RATE = 'RECEIVED_USER_SUCCESS_RATE';
export const REQUEST_USER_SUCCESS_RATE = 'REQUEST_USER_SUCCESS_RATE';
export const SET_LESSON_SUCCESS_RATE_MESSAGE = 'SET_LESSON_SUCCESS_RATE_MESSAGE';
export const SET_LESSON_SUCCESS_RATE = 'SET_LESSON_SUCCESS_RATE';
export const RECEIVE_CORRECT_ATTEMPT = 'RECEIVE_CORRECT_ATTEMPT';
export const RECEIVE_INCORRECT_ATTEMPT = 'RECEIVE_INCORRECT_ATTEMPT';
export const RESET_ATTEMPTS = 'RESET_ATTEMPTS';

export function calcLessonSuccessRateMessage(lessonSuccessRate) {
  let lessonSuccessRateMessage = '';
  const emojiFeedback = {
    veryBad: String.fromCodePoint(0x1F61E),
    bad: String.fromCodePoint(0x1F615),
    average: String.fromCodePoint(0x1F610),
    good: String.fromCodePoint(0x1F642),
    veryGood: String.fromCodePoint(0x1F600)
  };

  lessonSuccessRateMessage = `${lessonSuccessRate}%`;
  if (this.lessonSuccessRate >= 80) {
    lessonSuccessRateMessage += `, ${lessonSuccessRateMessage} ${emojiFeedback.veryGood}`;
  } else if (this.lessonSuccessRate < 80 && this.lessonSuccessRate >= 60) {
    lessonSuccessRateMessage += `, ${lessonSuccessRateMessage} ${emojiFeedback.good}`;
  } else if (this.lessonSuccessRate < 60 && this.lessonSuccessRate >= 40) {
    lessonSuccessRateMessage += `, ${lessonSuccessRateMessage} ${emojiFeedback.average}`;
  } else if (this.lessonSuccessRate < 40 && this.lessonSuccessRate >= 20) {
    lessonSuccessRateMessage += `, ${lessonSuccessRateMessage} ${emojiFeedback.bad}`;
  } else if (this.lessonSuccessRate < 20) {
    lessonSuccessRateMessage += `, ${lessonSuccessRateMessage} ${emojiFeedback.veryBad}`;
  }

  return {
    type: SET_LESSON_SUCCESS_RATE_MESSAGE,
    description: 'Set lesson success rate message',
    lessonSuccessRateMessage
  };
}

export function receiveLessonSuccessRate(lessonSuccessRate) {
  return {
    type: SET_LESSON_SUCCESS_RATE,
    description: 'Set lesson success rate',
    lessonSuccessRate
  };
}

export function calcLessonSuccessRate() {
  return function (dispatch) {
    let lessonSuccessRate = 0;

    if (this.totalAttempts > 0) {
      lessonSuccessRate = ((this.correctAttempts / this.totalAttempts) * 100).toFixed(0);
    }

    dispatch(receiveLessonSuccessRate(lessonSuccessRate));
    dispatch(calcLessonSuccessRateMessage(lessonSuccessRate));
  };
}

export function receiveCorrectAttempt() {
  return {
    type: RECEIVE_CORRECT_ATTEMPT,
    description: 'Used made a correct attempt'
  };
}

export function receiveIncorrectAttempt() {
  return {
    type: RECEIVE_INCORRECT_ATTEMPT,
    description: 'Used made an incorrect attempt'
  };
}

export function resetAttempts() {
  return {
    type: RESET_ATTEMPTS,
    description: 'Reset attempts'
  };
}

export function receiveUserSuccessRate(successRate, status, response) {
  return {
    type: RECEIVE_USER_SUCCESS_RATE,
    description: 'Received user success rate',
    successRate,
    status,
    response,
    lastReceived: Date.now() };
}

export function requestUserSuccessRate() {
  return {
    type: REQUEST_USER_SUCCESS_RATE,
    description: 'We are requesting success rate'
  };
}

export function fetchUserSuccessRate(username) {
  return function (dispatch) {
    dispatch(requestUserSuccessRate());

    return fetch(`api/statistics/${username}`, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(data => dispatch(receiveUserSuccessRate(data, 'success', data)))
      .catch(ex => dispatch(receiveUserSuccessRate(0, 'error', ex)));
  };
}

export const actionCreators = {
  requestUserSuccessRate,
  fetchUserSuccessRate,
  receiveUserSuccessRate,
  receiveCorrectAttempt,
  receiveIncorrectAttempt,
  calcLessonSuccessRate
};

// ----------------
// REDUCER - For a given state and action, returns the new state.
// To support time travel, this must not mutate the old state.
export const reducer = (state, action) => {
  switch (action.type) {
    default:
      return state || defaultState;
    case RECEIVE_USER_SUCCESS_RATE:
      return {
        ...state,
        successRate: action.successRate,
        requestingSuccessRate: false,
        requestSuccessRateStatus: action.status,
        requestSuccessRateResponse: action.response,
        requestSuccessRateLastReceived: action.lastReceived
      };
    case REQUEST_USER_SUCCESS_RATE:
      return {
        ...state,
        requestingSuccessRate: true
      };
    case SET_LESSON_SUCCESS_RATE:
      return {
        ...state,
        lessonSuccessRate: action.lessonSuccessRate
      };
    case SET_LESSON_SUCCESS_RATE_MESSAGE:
      return {
        ...state,
        lessonSuccessRateMessage: action.lessonSuccessRateMessage
      };
    case RECEIVE_CORRECT_ATTEMPT:
      return {
        ...state,
        correctAttempts: this.correctAttempts + 1,
        totalAttempts: this.totalAttempts + 1
      };
    case RECEIVE_INCORRECT_ATTEMPT:
      return {
        ...state,
        totalAttempts: this.totalAttempts + 1
      };
    case RESET_ATTEMPTS:
      return {
        ...state,
        correctAttempts: 0,
        totalAttempts: 0,
        lessonSuccessRate: 0
      };
  }
};

// Not needed since we only have 1 reducer
// const randomStore = combineReducers({
//   reducer
// });
