// import { combineReducers } from 'redux';
import 'whatwg-fetch';
// For temporary page management
import React from 'react';

import Utility from './util/Utility';

// For temporary page management
// import GuessPlayPage from './components/GuessPlayPage';
// import AboutPage from './components/AboutPage';
// import TranslationPlayPage from './components/TranslationPlayPage';
// import NuggetListPage from './components/NuggetListPage';
// import LessonSelection from './components/LessonSelection';
// import LandingPage from './components/LandingPage';
// import EndScreenPage from './components/EndScreenPage';
// import UserStatisticPage from './components/UserStatisticsPage';
// import QuizPlayPage from './components/QuizPlayPage';
// import QuizSelection from './components/QuizSelection';

// ----------------
// DEFAULT STATE
//

export const defaultState = {
  successRate: 0,
  lessonSuccessRate: 0,
  lessonSuccessRateMessage: '',
  requestingSuccessRate: false,
  requestSuccessRateStatus: null,
  requestSuccessRateResponse: null,
  requestSuccessRateLastReceived: null,
  // App.js
  currentPageName: null,
  currentPage: null,
  switchPageRef: null,

  // GakuseiNav.js
  gamemode: null,

  // LessonSelection.js
  lessonNames: ['JLPT N3', 'JLPT N4', 'JLPT N5', 'GENKI 1', 'GENKI 13', 'GENKI 15'],
  fetchURL: '/api/questions',

  // GenericSelection.js
  selectedLesson: null,

  // FourAlternativeQuestion.js
  questions: [], // contains object array of properties: question, alternative1, alternative2, alternative3, correctAlternative
  processedQuestion: {
    actualQuestionShapes: [],
    correctAlternative: null,
    randomizedAlternatives: [],
    buttonStyles: ['default', 'default', 'default', 'default'],
    buttonDisabled: false,
    resourceRef: []
  },
  resourceRef: null,
  allButtonsDisabled: false,
  userAnswers: [],
  lessonLength: 0,
  // Things originally in SessionStorage
  correctAttempts: 0,
  totalAttempts: 0,
  currentQuestionIndex: 0,

  // Security
  loggedIn: false,
  loggedInUser: null,
  csrf: null
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
export const INCREMENT_QUESTION_INDEX = 'INCREMENT_QUESTION_INDEX';
export const RESET_QUESTION_INDEX = 'RESET_QUESTION_INDEX';
export const RECEIVE_LESSON = 'RECEIVE_LESSON';
export const RECEIVE_NEXT_PROCESSED_QUESTION = 'RECEIVE_NEXT_PROCESSED_QUESTION';
export const SET_SELECTED_LESSON = 'SET_SELECTED_LESSON';
export const SET_GAMEMODE = 'SET_GAMEMODE';
export const SET_PAGE = 'SET_PAGE';
export const SET_ALL_BUTTONS_DISABLED_STATE = 'SET_ALL_BUTTONS_DISABLED_STATE';
export const ADD_USER_ANSWER = 'ADD_USER_ANSWER';
export const CLEAR_USER_ANSWERS = 'CLEAR_USER_ANSWERS';
export const SHOW_ANSWER_BUTTON_STYLES = 'SHOW_ANSWER_BUTTON_STYLES';
export const RECEIVE_ANSWER_BUTTON_STYLES = 'RECEIVE_ANSWER_BUTTON_STYLES';
export const CLEAR_ANSWERS = 'CLEAR_ANSWERS';

// Security stuff
export const RECEIVE_CSRF = 'RECEIVE_CSRF';
export const REQUEST_CSRF = 'REQUEST_CSRF';
export const RECEIVE_LOGGED_IN_USER = 'RECEIVE_LOGGED_IN_USER';
export const REQUEST_LOGGED_IN_USER = 'REQUEST_LOGGED_IN_USER';

// Switchpage (temporary)
export const SET_SWITCH_PAGE_REF = 'SET_SWITCH_PAGE_REF';

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

export function calcAnswerButtonStyles(userAnswerWord) {
  let newButtonStyles = [];

  newButtonStyles = this.processedQuestion.randomizedAlternatives.map((word) => {
    if (word === userAnswerWord) {
      return 'danger';
    } else if (word === this.processedQuestion.correctAlternative) {
      return 'success';
    }
    return 'default';
  });

  return {
    type: RECEIVE_ANSWER_BUTTON_STYLES,
    description: 'Set the style of each answer button',
    buttonStyles: newButtonStyles
  };
}

export function addUserAnswer(userActualAnswer) {
  return {
    type: ADD_USER_ANSWER,
    description: 'Add an answer a user made, along with correct results',
    userAnswer: [...this.userAnswers, [
      this.processedQuestion.question,
      this.processedQuestion.correctAlternative,
      userActualAnswer
    ]]
  };
}

export function clearUserAnswers() {
  return {
    type: CLEAR_USER_ANSWERS,
    description: 'Clear user answer history'
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

export function clearAnswers() {
  return {
    type: CLEAR_ANSWERS,
    description: 'Clear the answers object'
  };
}

export function setAllButtonsDisabledState(disabled) {
  return {
    type: SET_ALL_BUTTONS_DISABLED_STATE,
    description: 'Enables or disables all quiz buttons',
    allButtonsDisabled: disabled
  };
}

export function setSwitchPageReference(switchPageRef) {
  return {
    type: SET_SWITCH_PAGE_REF,
    description: 'Set reference to switchpage',
    switchPageRef
  };
}

export function setPageByName(pageName) {
  return function (dispatch, getState) {
    getState().reducer.switchPageRef(pageName);

    dispatch({
      type: SET_PAGE,
      description: 'Set current page for use in switchPage',
      currentPageName: pageName
    });
  };
}

export function setGameMode(gamemode) {
  return {
    type: SET_GAMEMODE,
    description: 'Set the current gamemode',
    gamemode
  };
}

export function calcNextQuestion() {
  return function (dispatch, getState) {
    const state = getState();
    const localQuestionIndex = getState().reducer.currentQuestionIndex + 1;

    const processedQuestion = {
      actualQuestionShapes: state.questions[localQuestionIndex].question,
      correctAlternative: state.questions[localQuestionIndex].correctAlternative,
      randomizedAlternatives: Utility.randomizeOrder([
        state.questions[localQuestionIndex].alternative1,
        state.questions[localQuestionIndex].alternative2,
        state.questions[localQuestionIndex].alternative3,
        state.questions[localQuestionIndex].correctAlternative]),
      buttonStyles: ['default', 'default', 'default', 'default'],
      buttonDisabled: false,
      resourceRef: state.questions[localQuestionIndex].resourceReference
    };

    dispatch(this.receiveNextProcessedQuestion(processedQuestion));

    // Utility.logEvent(this.currentPageName, 'question', this.state.question, this.props.loggedInUser);
    // for (let i = 0; i < this.state.randomOrderAlt.length; i += 1) {
    //   Utility.logEvent(this.currentPageName, 'alternative', this.state.randomOrderAlt[i], this.props.loggedInUser);
    // }
  };
}

export function receiveNextProcessedQuestion(processedQuestion) {
  return {
    type: RECEIVE_NEXT_PROCESSED_QUESTION,
    description: 'We have received the next question, randomized and processed for quiz-time',
    processedQuestion
  };
}

// To be deprecated
export function incrementQuestionIndex() {
  return {
    type: INCREMENT_QUESTION_INDEX,
    description: 'Increment the question index'
  };
}

export function resetQuestionIndex() {
  return {
    type: RESET_QUESTION_INDEX,
    description: 'Reset the question index'
  };
}

export function setSelectedLesson(lessonName) {
  return {
    type: SET_SELECTED_LESSON,
    description: 'Set the selected lesson name',
    lessonName
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

export function receiveLesson(jsonQuestions) {
  return {
    type: RECEIVE_LESSON,
    description: 'Received lesson data in json-format',
    questions: JSON.parse(jsonQuestions)
  };
}

export function resetLesson() {
  return function (dispatch) {
    dispatch(resetAttempts());
    dispatch(resetQuestionIndex());
    dispatch(clearAnswers());
  };
}

export function fetchLesson(temporarySwitchpageCallback) {
  return function (dispatch) {
    return fetch(`${this.fetchURL}?lessonName=${this.selectedLesson}`, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(
        (json) => {
          // sessionStorage.lesson = JSON.stringify(json);
          dispatch(receiveLesson(json));
          temporarySwitchpageCallback();
        })
      .catch(ex => console.log('Fel vid hämtning av spelomgång', ex));
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

export const actionCreators = {
  requestUserSuccessRate,
  fetchUserSuccessRate,
  receiveUserSuccessRate,
  receiveCorrectAttempt,
  receiveIncorrectAttempt,
  calcLessonSuccessRate,
  // incrementQuestionIndex,
  resetQuestionIndex,
  fetchLesson,
  setSelectedLesson,
  setGameMode,
  setPageByName,
  calcNextQuestion,
  setAllButtonsDisabledState,
  addUserAnswer,
  clearUserAnswers,
  resetAttempts,
  calcAnswerButtonStyles,
  resetLesson,
  // Security
  fetchCSRF,
  requestCSRF,
  receiveCSRF,
  fetchLoggedInUser,
  requestLoggedInUser,
  receiveLoggedInUser,
  setSwitchPageReference
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
    case SET_ALL_BUTTONS_DISABLED_STATE:
      return {
        ...state,
        allButtonsDisabled: action.allButtonsDisabled
      };
    case RECEIVE_ANSWER_BUTTON_STYLES:
      return {
        ...state,
        processedQuestion: { ...this.processedQuestion, buttonStyles: action.buttonStyles }
      };
    case CLEAR_ANSWERS:
      return {
        ...state,
        userAnswers: []
      };
    case SET_SWITCH_PAGE_REF:
      return {
        ...state,
        switchPageRef: action.switchPageRef
      };
    case SET_PAGE:
      return {
        ...state,
        currentPageName: action.currentPageName
      };
    case ADD_USER_ANSWER:
      return {
        ...state,
        userAnswers: action.userAnswers
      };
    case CLEAR_USER_ANSWERS:
      return {
        ...state,
        userAnswers: []
      };
    case RECEIVE_LESSON:
      return {
        ...state,
        questions: action.questions,
        lessonLength: action.questions.length
      };
    case REQUEST_USER_SUCCESS_RATE:
      return {
        ...state,
        requestingSuccessRate: true
      };
    case SET_GAMEMODE:
      return {
        ...state,
        gamemode: action.gamemode
      };
    case RECEIVE_NEXT_PROCESSED_QUESTION:
      return {
        ...state,
        processedQuestion: action.processedQuestion,
        resourceRef: action.processedQuestion.resourceRef,
        currentQuestionIndex: this.currentQuestionIndex + 1
      };
    case SET_SELECTED_LESSON:
      return {
        ...state,
        selectedLesson: action.lessonName
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
    case INCREMENT_QUESTION_INDEX:
      return {
        ...state,
        currentQuestionIndex: this.currentQuestionIndex + 1
      };
    case RESET_QUESTION_INDEX:
      return {
        ...state,
        currentQuestionIndex: 0
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
  reducer
};

// Not needed since we only have 1 reducer..?
// const randomStore = combineReducers({
//   reducer
// });
