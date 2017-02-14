// import { combineReducers } from 'redux';
import 'whatwg-fetch';
// For temporary page management
import React from 'react';
import { browserHistory } from 'react-router';
import { push } from 'react-router-redux';

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
  lessonNames: [],
  // fetchURL: '/api/questions',

  // GenericSelection.js
  selectedLesson: '',
  questionType: 'reading',
  answerType: 'swedish',

  // FourAlternativeQuestion.js
  questions: [],
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
  processedQuestionsWithAnswer: [],
  lessonLength: 0,
  // Things originally in SessionStorage
  correctAttempts: 0,
  totalAttempts: 0,
  currentQuestionIndex: 0,
  currentProcessedQuestionAnswered: false,
  currentProcessedQuestionAnsweredCorrectly: false,

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
export const SET_LESSON_NAMES = 'SET_LESSON_NAMES';
export const CLEAR_PROCESSED_QUESTION = 'CLEAR_PROCESSED_QUESTION';
export const RECEIVE_LOGGED_IN_STATUS = 'RECEIVE_LOGGED_IN_STATUS';

// Security stuff
export const RECEIVE_CSRF = 'RECEIVE_CSRF';
export const REQUEST_CSRF = 'REQUEST_CSRF';
export const RECEIVE_LOGGED_IN_USER = 'RECEIVE_LOGGED_IN_USER';
export const REQUEST_LOGGED_IN_USER = 'REQUEST_LOGGED_IN_USER';

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
  if (lessonSuccessRate >= 80) {
    lessonSuccessRateMessage += `, ${lessonSuccessRateMessage} ${emojiFeedback.veryGood}`;
  } else if (lessonSuccessRate < 80 && lessonSuccessRate >= 60) {
    lessonSuccessRateMessage += `, ${lessonSuccessRateMessage} ${emojiFeedback.good}`;
  } else if (lessonSuccessRate < 60 && lessonSuccessRate >= 40) {
    lessonSuccessRateMessage += `, ${lessonSuccessRateMessage} ${emojiFeedback.average}`;
  } else if (lessonSuccessRate < 40 && lessonSuccessRate >= 20) {
    lessonSuccessRateMessage += `, ${lessonSuccessRateMessage} ${emojiFeedback.bad}`;
  } else if (lessonSuccessRate < 20) {
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
  return function (dispatch, getState) {
    const state = getState().reducer;
    let lessonSuccessRate = 0;

    if (state.totalAttempts > 0) {
      lessonSuccessRate = ((state.correctAttempts / state.totalAttempts) * 100).toFixed(0);
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

export function calcAnswerButtonStyles() {
  return function (dispatch, getState) {
    const state = getState().reducer;

    const userAnswerWord = state
      .processedQuestionsWithAnswer[state.currentQuestionIndex]
      .userAnswer;

    let newButtonStyles = [];

    newButtonStyles = state.processedQuestion.randomizedAlternatives.map((word) => {
      if (word.toLowerCase() === userAnswerWord.toLowerCase()) {
        return 'danger';
      } else if (word === state.processedQuestion.correctAlternative) {
        return 'success';
      }
      return 'default';
    });

    dispatch({
      type: RECEIVE_ANSWER_BUTTON_STYLES,
      description: 'Set the style of each answer button',
      buttonStyles: newButtonStyles
    });
  };
}

export function receiveIncorrectAttempt() {
  return {
    type: RECEIVE_INCORRECT_ATTEMPT,
    description: 'Used made an incorrect attempt'
  };
}

export function addUserAnswer(userActualAnswer) {
  return function (dispatch, getState) {
    const state = getState().reducer;

    const processedQuestionWithAnswer = {
      ...state.processedQuestion,
      userAnswer: userActualAnswer,
      userCorrect: (userActualAnswer.toLowerCase() ===
                    state.processedQuestion.correctAlternative.toLowerCase())
    };

    if (processedQuestionWithAnswer.userCorrect) {
      dispatch(receiveCorrectAttempt());
    } else {
      dispatch(receiveIncorrectAttempt());
    }

    dispatch({ type: ADD_USER_ANSWER,
      description: 'Add an answer a user made, along with correct results',
      processedQuestionWithAnswer });
  };
}

export function clearUserAnswers() {
  return {
    type: CLEAR_USER_ANSWERS,
    description: 'Clear user answer history'
  };
}

export function resetAttempts() {
  return {
    type: RESET_ATTEMPTS,
    description: 'Reset attempts'
  };
}

export function setAllButtonsDisabledState(disabled) {
  return {
    type: SET_ALL_BUTTONS_DISABLED_STATE,
    description: 'Enables or disables all quiz buttons',
    allButtonsDisabled: disabled
  };
}

export function setPageByName(pageName, params = null, _state = null) {
  return function (dispatch) {
    // getState().reducer.switchPageRef(pageName);

    // browserHistory.push(pageName, params);
    // dispatch(push(`${pageName}?test=123`));
    // dispatch(push(pageName, ...params)); // Bork
    dispatch(push({
      pathname: `${pageName}`,
      query: { ...params },
      state: _state
    }));

    dispatch({
      type: SET_PAGE,
      description: 'Set name of current page, for supporting deprecated functions',
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

export function incrementQuestionIndex() {
  return {
    type: INCREMENT_QUESTION_INDEX,
    description: 'Increment the question index'
  };
}

export function receiveNextProcessedQuestion(processedQuestion) {
  return {
    type: RECEIVE_NEXT_PROCESSED_QUESTION,
    description: 'We have received the next question, randomized and processed for quiz-time',
    processedQuestion
  };
}

export function calcNextQuestion() {
  return function (dispatch, getState) {
    const state = getState().reducer;
    const localQuestionIndex = state.currentQuestionIndex;

    const processedQuestion = {
      actualQuestionShapes: state.questions[localQuestionIndex].question.map(s => s.toLowerCase()),
      correctAlternative: state.questions[localQuestionIndex].correctAlternative.toLowerCase(),
      randomizedAlternatives: Utility.randomizeOrder([
        state.questions[localQuestionIndex].alternative1.toLowerCase(),
        state.questions[localQuestionIndex].alternative2.toLowerCase(),
        state.questions[localQuestionIndex].alternative3.toLowerCase(),
        state.questions[localQuestionIndex].correctAlternative.toLowerCase()]),
      buttonStyles: ['default', 'default', 'default', 'default'],
      buttonDisabled: false,
      resourceRef: state.questions[localQuestionIndex].resourceReference || null
    };

    dispatch(incrementQuestionIndex());

    dispatch(receiveNextProcessedQuestion(processedQuestion));

    // Utility.logEvent(this.currentPageName, 'question', this.state.question, this.props.loggedInUser);
    // for (let i = 0; i < this.state.randomOrderAlt.length; i += 1) {
    //   Utility.logEvent(this.currentPageName, 'alternative', this.state.randomOrderAlt[i], this.props.loggedInUser);
    // }
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

export function requestUserRegister(form) {
    return function (dispatch, getState) {
    fetch('/registeruser', {
      method: 'POST',
      body: form
    })// .then(response => response.json())
      .then((result) => {
        // dispatch(setLessonNames(result));
        debugger;
      });
  };
}

export function requestUserLogin(form) {
  return function (dispatch, getState) {
    fetch('/auth', {
      method: 'POST',
      body: form
    })// .then(response => response.json())
      .then((result) => {
        // dispatch(setLessonNames(result));
        debugger;
      });

    // fetch(`/auth?usernameId=${username}&passwordId=${password}&csrfId=${csrf}`, { credentials: 'same-origin' })
    //   .then(response => response.json())
    //   .then((result) => {
    //     // dispatch(setLessonNames(result));
    //     debugger;
    //   });
  };
}

export function receiveLesson(questions) {
  return {
    type: RECEIVE_LESSON,
    description: 'Received lesson data in json-format',
    questions
  };
}

export function clearProcessedQuestion() {
  return {
    type: CLEAR_PROCESSED_QUESTION,
    description: 'Clears the content of the processed question. Sort of unnecessary..'
  };
}

export function resetLesson() {
  return function (dispatch) {
    dispatch(resetAttempts());
    dispatch(resetQuestionIndex());
    dispatch(clearUserAnswers());
  };
}


export function setLessonNames(lessonNames) {
  return function (dispatch, getState) {
    const state = getState().reducer;

    const something = dispatch({
      type: SET_LESSON_NAMES,
      description: 'Manually set lesson names. Temporary function.',
      lessonNames
    });

    dispatch(setSelectedLesson(something.lessonNames[0]));
  };
}


export function fetchLessonNames(type) {
  return function (dispatch) {
    const lessonType = type === 'quiz' ? 'quiz' : 'vocabulary';
    fetch(`/api/lessonNames?lessonType=${lessonType}`, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(result => dispatch(setLessonNames(result)));
      // .catch(ex => console.log('Fel vid hämtning av spelomgång', ex));
  };
}

export function fetchLesson(lessonType, temporaryCallback) {
  let fetchURL;

  if (lessonType === 'quiz') {
    fetchURL = '/api/quiz';
  } else if (lessonType === 'guess') {
    fetchURL = '/api/questions';
  } else if (lessonType === 'translate') {
    fetchURL = '/api/questions';
  }

  return function (dispatch, getState) {
    const state = getState().reducer;
    return fetch(`${fetchURL}?lessonName=${state.selectedLesson}&questionType=${state.questionType}&` +
      `answerType=${state.answerType}`, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(
        (json) => {
          // sessionStorage.lesson = JSON.stringify(json);
          dispatch(receiveLesson(json));
          dispatch(calcNextQuestion());
          temporaryCallback();
          // temporarySwitchpageCallback();
        });
      // .catch(ex => console.log('Fel vid hämtning av spelomgång', ex));
  };
}

export function fetchUserSuccessRate(username) {
  return function (dispatch) {
    dispatch(requestUserSuccessRate());

    return fetch(`api/statistics/${username}`, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(data => dispatch(receiveUserSuccessRate(data, 'success', data)));
      // .catch(ex => dispatch(receiveUserSuccessRate(0, 'error', ex)));
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
  fetchLessonNames,
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
  setLessonNames,
  requestUserLogin,
  requestUserRegister
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
    case CLEAR_PROCESSED_QUESTION:
      return {
        ...state,
        processedQuestion: {
          actualQuestionShapes: [],
          correctAlternative: null,
          randomizedAlternatives: [],
          buttonStyles: ['default', 'default', 'default', 'default'],
          buttonDisabled: false,
          resourceRef: []
        }
      };
    case RECEIVE_ANSWER_BUTTON_STYLES:
      return {
        ...state,
        processedQuestion: { ...state.processedQuestion, buttonStyles: action.buttonStyles }
      };
    case SET_PAGE:
      return {
        ...state,
        currentPageName: action.currentPageName
      };
    case ADD_USER_ANSWER:
      return {
        ...state,
        processedQuestionsWithAnswer: [...state.processedQuestionsWithAnswer, action.processedQuestionWithAnswer]
      };
    case CLEAR_USER_ANSWERS:
      return {
        ...state,
        processedQuestionsWithAnswer: [],
        currentProcessedQuestionAnswered: false,
        currentProcessedQuestionAnsweredCorrectly: null
      };
    case RECEIVE_LESSON:
      return {
        ...state,
        questions: action.questions,
        lessonLength: action.questions.length
      };
    case SET_LESSON_NAMES:
      return {
        ...state,
        lessonNames: action.lessonNames
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
        currentProcessedQuestionAnswered: false,
        currentProcessedQuestionAnsweredCorrectly: null
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
        currentQuestionIndex: state.currentQuestionIndex + 1
      };
    case RESET_QUESTION_INDEX:
      return {
        ...state,
        currentQuestionIndex: 0
      };
    case RECEIVE_LOGGED_IN_STATUS:
      return {
        ...state,
        loggedIn: action.loggedIn
      };
    case RECEIVE_CORRECT_ATTEMPT:
      return {
        ...state,
        correctAttempts: state.correctAttempts + 1,
        totalAttempts: state.totalAttempts + 1,
        currentProcessedQuestionAnswered: true,
        currentProcessedQuestionAnsweredCorrectly: true
      };
    case RECEIVE_INCORRECT_ATTEMPT:
      return {
        ...state,
        totalAttempts: state.totalAttempts + 1,
        currentProcessedQuestionAnswered: true,
        currentProcessedQuestionAnsweredCorrectly: false
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
