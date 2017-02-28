import 'whatwg-fetch';
import React from 'react';

import Utility from '../../shared/util/Utility';

// ----------------
// DEFAULT STATE
export const defaultState = {
  successRate: 0,
  lessonSuccessRate: 0,
  lessonSuccessRateMessage: '',
  requestingSuccessRate: false,
  requestSuccessRateStatus: null,
  requestSuccessRateResponse: null,
  requestSuccessRateLastReceived: null,

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
    correctAlternative: [],
    randomizedAlternatives: [],
    buttonStyles: ['default', 'default', 'default', 'default'],
    buttonDisabled: false,
    resourceRef: {}
  },
  // resourceRef: null,
  allButtonsDisabled: false,
  processedQuestionsWithAnswers: [],
  lessonLength: 0,
  // Things originally in SessionStorage
  correctAttempts: 0,
  totalAttempts: 0,
  currentQuestionIndex: 0,
  currentProcessedQuestionAnswered: false,
  currentProcessedQuestionAnsweredCorrectly: false
};
// ----------------
// PROPTYPES
export const propTypes = {
  lessonSuccessRateMessage: React.PropTypes.string.isRequired,
  processedQuestion: React.PropTypes.shape({
    actualQuestionShapes: React.PropTypes.array.isRequired,
    correctAlternative: React.PropTypes.array.isRequired,
    randomizedAlternatives: React.PropTypes.array.isRequired,
    buttonStyles: React.PropTypes.array.isRequired,
    buttonDisabled: React.PropTypes.bool.isRequired,
    resourceRef: React.PropTypes.object }).isRequired,
  allButtonsDisabled: React.PropTypes.bool.isRequired,
  lessonLength: React.PropTypes.number.isRequired,
  correctAttempts: React.PropTypes.number.isRequired,
  currentQuestionIndex: React.PropTypes.number.isRequired,
  calcAnswerButtonStyles: React.PropTypes.func.isRequired,
  questionType: React.PropTypes.string.isRequired,
  answerType: React.PropTypes.string.isRequired
};

// -----------------
// ACTION CONSTANTS - Just used to differentiate the "actions"
export const RECEIVE_USER_SUCCESS_RATE = 'RECEIVE_USER_SUCCESS_RATE';
export const REQUEST_USER_SUCCESS_RATE = 'REQUEST_USER_SUCCESS_RATE';
export const SET_LESSON_SUCCESS_RATE_MESSAGE = 'SET_LESSON_SUCCESS_RATE_MESSAGE';
export const SET_LESSON_SUCCESS_RATE = 'SET_LESSON_SUCCESS_RATE';
export const RECEIVE_CORRECT_ATTEMPT = 'RECEIVE_CORRECT_ATTEMPT';
export const RECEIVE_INCORRECT_ATTEMPT = 'RECEIVE_INCORRECT_ATTEMPT';
export const RESET_ATTEMPTS = 'RESET_ATTEMPTS';
export const INCREMENT_QUESTION_INDEX = 'INCREMENT_QUESTION_INDEX';
export const RESET_QUESTION_INDEX = 'RESET_QUESTION_INDEX';
export const RECEIVE_LESSON = 'RECEIVE_LESSON';
export const RECEIVE_PROCESSED_QUESTION = 'RECEIVE_NEXT_PROCESSED_QUESTION';
export const SET_SELECTED_LESSON = 'SET_SELECTED_LESSON';
export const SET_GAMEMODE = 'SET_GAMEMODE';
export const SET_ALL_BUTTONS_DISABLED_STATE = 'SET_ALL_BUTTONS_DISABLED_STATE';
export const ADD_USER_ANSWER = 'ADD_USER_ANSWER';
export const CLEAR_USER_ANSWERS = 'CLEAR_USER_ANSWERS';
export const SHOW_ANSWER_BUTTON_STYLES = 'SHOW_ANSWER_BUTTON_STYLES';
export const RECEIVE_ANSWER_BUTTON_STYLES = 'RECEIVE_ANSWER_BUTTON_STYLES';
export const SET_LESSON_NAMES = 'SET_LESSON_NAMES';
export const CLEAR_PROCESSED_QUESTION = 'CLEAR_PROCESSED_QUESTION';
export const SET_QUESTION_LANGUAGE = 'SET_QUESTION_LANGUAGE';
export const SET_ANSWER_LANGUAGE = 'SET_ANSWER_LANGUAGE';

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.
export function calcLessonSuccessRateMessage() {
  return function (dispatch, getState) {
    const state = getState().lessons;
    const lessonSuccessRate = state.lessonSuccessRate;

    let lessonSuccessRateMessage = '';

    if (state.totalAttempts > 0) {
      const emojiFeedback = {
        veryBad: String.fromCodePoint(0x1F61E),
        bad: String.fromCodePoint(0x1F615),
        average: String.fromCodePoint(0x1F610),
        good: String.fromCodePoint(0x1F642),
        veryGood: String.fromCodePoint(0x1F600)
      };

      lessonSuccessRateMessage = `(${lessonSuccessRate}%)`;
      if (lessonSuccessRate >= 80) {
        lessonSuccessRateMessage += ` ${emojiFeedback.veryGood}`;
      } else if (lessonSuccessRate < 80 && lessonSuccessRate >= 60) {
        lessonSuccessRateMessage += ` ${emojiFeedback.good}`;
      } else if (lessonSuccessRate < 60 && lessonSuccessRate >= 40) {
        lessonSuccessRateMessage += ` ${emojiFeedback.average}`;
      } else if (lessonSuccessRate < 40 && lessonSuccessRate >= 20) {
        lessonSuccessRateMessage += ` ${emojiFeedback.bad}`;
      } else if (lessonSuccessRate < 20) {
        lessonSuccessRateMessage += ` ${emojiFeedback.veryBad}`;
      }
    }

    dispatch({
      type: SET_LESSON_SUCCESS_RATE_MESSAGE,
      description: 'Set lesson success rate message',
      lessonSuccessRateMessage
    });
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
    const state = getState().lessons;
    let lessonSuccessRate = 0;

    if (state.totalAttempts > 0) {
      lessonSuccessRate = ((state.correctAttempts / state.totalAttempts) * 100).toFixed(0);
    }

    dispatch(receiveLessonSuccessRate(lessonSuccessRate));
    dispatch(calcLessonSuccessRateMessage());
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
    const state = getState().lessons;

    const userAnswerWord = state
      .processedQuestionsWithAnswers[state.currentQuestionIndex]
      .userAnswer;

    const newButtonStyles = state.processedQuestion.randomizedAlternatives.map(words =>
      words.map((word) => {
        if (state.processedQuestion.correctAlternative.indexOf(word) !== -1) {
          return 'success';
        } else if (word.toLowerCase() === userAnswerWord.toLowerCase()) {
          return 'danger';
        }
        return 'default';
      }).filter(val => val !== 'default').pop() || 'default'
    );

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
    const state = getState().lessons;
    const securityState = getState().security;

    const processedQuestionWithAnswer = {
      ...state.processedQuestion,
      userAnswer: userActualAnswer,
      userCorrect: state.processedQuestion.correctAlternative
      .some(s => s.toLowerCase() === userActualAnswer.toLowerCase())
    };

    if (processedQuestionWithAnswer.userCorrect) {
      dispatch(receiveCorrectAttempt());
    } else {
      dispatch(receiveIncorrectAttempt());
    }

    Utility.logEvent('Lessons', 'userAnswer', userActualAnswer, securityState.loggedInUser);
    Utility.logEvent('Lessons', 'correctAnswer', state.processedQuestion.actualQuestionShapes, securityState.loggedInUser);
    Utility.logEvent('Lessons', 'correctAnswer', state.processedQuestion.correctAlternative, securityState.loggedInUser);
    Utility.logEvent('Lessons', 'answeredCorrectly', processedQuestionWithAnswer.userCorrect, securityState.loggedInUser);

    dispatch(calcLessonSuccessRate());

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
  return function (dispatch) {
    dispatch({
      type: RESET_ATTEMPTS,
      description: 'Reset attempts'
    });

    dispatch(calcLessonSuccessRate());
  };
}

export function setAllButtonsDisabledState(disabled) {
  return {
    type: SET_ALL_BUTTONS_DISABLED_STATE,
    description: 'Enables or disables all quiz buttons',
    allButtonsDisabled: disabled
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

export function receiveProcessedQuestion(processedQuestion) {
  return function (dispatch, getState) {
    const securityState = getState().security;

    dispatch({
      type: RECEIVE_PROCESSED_QUESTION,
      description: 'We have received the next question, randomized and processed for play',
      processedQuestion
    });

    Utility.logEvent('lessons', 'question', processedQuestion.actualQuestionShapes, securityState.loggedInUser);
    for (let i = 0; i < processedQuestion.randomizedAlternatives.length; i += 1) {
      Utility.logEvent('lessons', 'alternative', processedQuestion.randomizedAlternatives[i], securityState.loggedInUser);
    }
  };
}

export function processCurrentQuestion() {
  return function (dispatch, getState) {
    const state = getState().lessons;
    const localQuestionIndex = state.currentQuestionIndex;

    const processedQuestion = {
      actualQuestionShapes: state.questions[localQuestionIndex].question.map(s => s.toLowerCase()),
      correctAlternative: state.questions[localQuestionIndex].correctAlternative.map(s => s.toLowerCase()),
      randomizedAlternatives: Utility.randomizeOrder([
        state.questions[localQuestionIndex].alternative1.map(s => s.toLowerCase()),
        state.questions[localQuestionIndex].alternative2.map(s => s.toLowerCase()),
        state.questions[localQuestionIndex].alternative3.map(s => s.toLowerCase()),
        state.questions[localQuestionIndex].correctAlternative.map(s => s.toLowerCase())]),
      buttonStyles: ['default', 'default', 'default', 'default'],
      buttonDisabled: false,
      resourceRef: state.questions[localQuestionIndex].resourceReference || null
    };

    dispatch(receiveProcessedQuestion(processedQuestion));
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
    dispatch(setAllButtonsDisabledState(false));
  };
}

export function setLessonNames(lessonNames) {
  return function (dispatch) {
    dispatch({
      type: SET_LESSON_NAMES,
      description: 'Manually set lesson names. Temporary function.',
      lessonNames
    });

    dispatch(setSelectedLesson(lessonNames[0]));
  };
}

export function setQuestionLanguage(language) {
  return function (dispatch, getState) {
    const state = getState().lessons;

    if (state.answerType === language) {
      dispatch({
        type: SET_ANSWER_LANGUAGE,
        description: 'Set the answer language',
        language: state.questionType
      });
    }

    dispatch({
      type: SET_QUESTION_LANGUAGE,
      description: 'Set the question language',
      language
    });
  };
}

export function setAnswerLanguage(language) {
  return function (dispatch, getState) {
    const state = getState().lessons;

    if (state.questionType === language) {
      dispatch({
        type: SET_QUESTION_LANGUAGE,
        description: 'Set the answer language',
        language: state.answerType
      });
    }
    dispatch({
      type: SET_ANSWER_LANGUAGE,
      description: 'Set the question language',
      language
    });
  };
}

export function fetchLessonNames(type) {
  return function (dispatch) {
    const lessonType = type === 'quiz' ? 'quiz' : 'vocabulary';
    fetch(`/api/lessonNames?lessonType=${lessonType}`, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(result => dispatch(setLessonNames(result)));
  };
}

export function fetchLesson(lessonType) {
  let fetchURL;

  if (lessonType === 'quiz') {
    fetchURL = '/api/quiz';
  } else if (lessonType === 'guess') {
    fetchURL = '/api/questions';
  } else if (lessonType === 'translate') {
    fetchURL = '/api/questions';
  }

  return function (dispatch, getState) {
    const lessonState = getState().lessons;
    const securityState = getState().security;
    return fetch(`${fetchURL}?lessonName=${lessonState.selectedLesson}&questionType=${lessonState.questionType}&` +
      `answerType=${lessonState.answerType}&username=${securityState.loggedInUser}`, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(
        (json) => {
          dispatch(resetLesson());
          dispatch(receiveLesson(json));
          dispatch(processCurrentQuestion());
        });
  };
}

export function fetchUserSuccessRate(username) {
  return function (dispatch) {
    dispatch(requestUserSuccessRate());

    fetch(`api/statistics/${username}`, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(data => dispatch(receiveUserSuccessRate(data, 'success', data)));
  };
}

export const actionCreators = {
  requestUserSuccessRate,
  fetchUserSuccessRate,
  receiveUserSuccessRate,
  receiveCorrectAttempt,
  receiveIncorrectAttempt,
  calcLessonSuccessRate,
  incrementQuestionIndex,
  resetQuestionIndex,
  fetchLesson,
  fetchLessonNames,
  setSelectedLesson,
  setGameMode,
  processCurrentQuestion,
  setAllButtonsDisabledState,
  addUserAnswer,
  clearUserAnswers,
  resetAttempts,
  calcAnswerButtonStyles,
  resetLesson,
  setLessonNames,
  setQuestionLanguage,
  setAnswerLanguage
};

// ----------------
// REDUCER - For a given state and action, returns the new state.
// To support time travel, this must not mutate the old state.
export const lessons = (state, action) => {
  switch (action.type) {
    default:
      return state || defaultState;
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
          correctAlternative: [],
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
    case ADD_USER_ANSWER:
      return {
        ...state,
        processedQuestionsWithAnswers: [...state.processedQuestionsWithAnswers, action.processedQuestionWithAnswer]
      };
    case CLEAR_USER_ANSWERS:
      return {
        ...state,
        processedQuestionsWithAnswers: [],
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
    case SET_GAMEMODE:
      return {
        ...state,
        gamemode: action.gamemode
      };
    case RECEIVE_PROCESSED_QUESTION:
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
    case SET_QUESTION_LANGUAGE:
      return {
        ...state,
        questionType: action.language
      };
    case SET_ANSWER_LANGUAGE:
      return {
        ...state,
        answerType: action.language
      };
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
  }
};

export const reducers = {
  lessons
};
