import 'whatwg-fetch';
import { REHYDRATE } from 'redux-persist/constants';

import getCSRF from '../../shared/util/getcsrf';
import Utility from '../../shared/util/Utility';
import PropTypes from 'prop-types';

// ----------------
// DEFAULT STATE
export const defaultState = {
  // statistics stuff
  successRate: 0,
  requestingSuccessRate: false,
  requestSuccessRateStatus: null,
  requestSuccessRateResponse: null,
  requestSuccessRateLastReceived: null,

  lessons: [],
  selectedLesson: { name: '' },
  addressedQuestionsInLessons: null,
  favoriteLesson: null,
  incorrectAnsweredLesson: {},

  // select/play stuff
  lessonSuccessRate: 0,
  lessonSuccessRateMessage: '',

  starredLessons: [],
  questionType: 'reading',
  answerType: 'swedish',
  playType: 'guess',

  kanjiDifficulty: 'easy',

  questions: [],
  currentQuestion: {
    shapes: [],
    correctAlternative: [],
    correctAlternativeNuggetId: '',
    // Button specifics
    randomizedAlternatives: [],
    buttonStyles: ['default', 'default', 'default', 'default'],
    buttonsDisabled: false,
    resourceRef: {},
    // Below added after user answers
    userAnswer: undefined,
    userCorrect: undefined,
    cardData: {}
  },

  allButtonsDisabled: false,
  answeredQuestions: [],
  lessonLength: 0,

  answerTextInputFocused: true,
  spacedRepetition: true,
  spacedRepetitionModes: ['guess', 'translate', 'flashcards', 'kanji'],

  // Things originally in SessionStorage
  correctAttempts: 0,
  totalAttempts: 0,
  currentQuestionIndex: 0,
  currentProcessedQuestionAnswered: false,
  currentProcessedQuestionAnsweredCorrectly: false,
  isFetchingLesson: false
};
// ----------------
// PROPTYPES
export const propTypes = {
  lessonSuccessRateMessage: PropTypes.string.isRequired,
  currentQuestion: PropTypes.shape({
    shapes: PropTypes.array.isRequired,
    correctAlternative: PropTypes.array.isRequired,
    correctAlternativeNuggetId: PropTypes.string,
    randomizedAlternatives: PropTypes.array.isRequired,
    buttonStyles: PropTypes.array.isRequired,
    buttonsDisabled: PropTypes.bool.isRequired,
    resourceRef: PropTypes.shape({
      type: PropTypes.string,
      location: PropTypes.string
    })
  }).isRequired,
  allButtonsDisabled: PropTypes.bool.isRequired,
  lessonLength: PropTypes.number.isRequired,
  correctAttempts: PropTypes.number.isRequired,
  currentQuestionIndex: PropTypes.number.isRequired,
  calcAnswerButtonStyles: PropTypes.func.isRequired,
  questionType: PropTypes.string.isRequired,
  answerType: PropTypes.string.isRequired,
  answerTextInputFocused: PropTypes.bool.isRequired,
  spacedRepetition: PropTypes.bool.isRequired,
  spacedRepetitionModes: PropTypes.array.isRequired,
  kanjiDifficulty: PropTypes.string.isRequired,
  isFetchingLesson: PropTypes.bool.isRequired
};

// -----------------
// ACTION CONSTANTS - Just used to differentiate the "actions"
export const RECEIVE_USER_SUCCESS_RATE = 'RECEIVE_USER_SUCCESS_RATE';
export const RECEIVE_USER_STARRED_LESSONS = 'RECEIVE_USER_STARRED_LESSONS';
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
export const RECEIVE_FAVORITE_LESSON = 'RECEIVE_FAVORITE_LESSON';
export const SET_SELECTED_LESSON = 'SET_SELECTED_LESSON';
export const SET_GAMEMODE = 'SET_GAMEMODE';
export const SET_ALL_BUTTONS_DISABLED_STATE = 'SET_ALL_BUTTONS_DISABLED_STATE';
export const SET_ANSWER_TEXT_INPUT_FOCUSED_STATE = 'SET_ANSWER_TEXT_INPUT_FOCUSED_STATE';
export const ADD_USER_ANSWER = 'ADD_USER_ANSWER';
export const CLEAR_USER_ANSWERS = 'CLEAR_USER_ANSWERS';
export const SHOW_ANSWER_BUTTON_STYLES = 'SHOW_ANSWER_BUTTON_STYLES';
export const RECEIVE_ANSWER_BUTTON_STYLES = 'RECEIVE_ANSWER_BUTTON_STYLES';
export const SET_LESSONS = 'SET_LESSONS';
export const CLEAR_PROCESSED_QUESTION = 'CLEAR_PROCESSED_QUESTION';
export const SET_QUESTION_LANGUAGE = 'SET_QUESTION_LANGUAGE';
export const SET_ANSWER_LANGUAGE = 'SET_ANSWER_LANGUAGE';
export const SET_ADDRESSED_QUESTIONS = 'SET_ADDRESSED_QUESTIONS';
export const SET_SPACED_REPETITION = 'SET_SPACED_REPETITION';
export const SET_KANJI_DIFFICULTY = 'SET_KANJI_DIFFICULTY';
export const SET_FETCHING_LESSON = 'SET_FETCHING_LESSON';
export const SET_INCORRECT_LESSON_COUNT = 'SET_INCORRECT_LESSON_COUNT';
export const RECEIVE_INCORRECT_LESSON_COUNT = 'RECEIVE_INCORRECT_LESSON_COUNT';
export const SET_LESSON_PLAY_TYPE = 'SET_LESSON_PLAY_TYPE';
export const SET_QUIZ_IMAGE = 'SET_QUIZ_IMAGE';
// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.
export function calcLessonSuccessRateMessage() {
  return function(dispatch, getState) {
    const state = getState().lessons;
    const lessonSuccessRate = state.lessonSuccessRate;

    let lessonSuccessRateMessage = '';

    if (state.totalAttempts > 0) {
      const emojiFeedback = {
        veryBad: String.fromCodePoint(0x1f61e),
        bad: String.fromCodePoint(0x1f615),
        average: String.fromCodePoint(0x1f610),
        good: String.fromCodePoint(0x1f642),
        veryGood: String.fromCodePoint(0x1f600)
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
  return function(dispatch, getState) {
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
  return function(dispatch, getState) {
    const state = getState().lessons;

    const userAnswerWord = state.answeredQuestions[state.currentQuestionIndex].userAnswer;

    const newButtonStyles = state.currentQuestion.randomizedAlternatives.map(
      words =>
        words
          .map(word => {
            if (state.currentQuestion.correctAlternative.some(s => s.includes(word))) {
              return 'success';
            } else if (!userAnswerWord || word.toLowerCase() === userAnswerWord.toLowerCase()) {
              return 'danger';
            }
            return 'default';
          })
          .filter(val => val !== 'default')
          .pop() || 'default'
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

export function addUserAnswer(userAnswerText, cardData) {
  return function(dispatch, getState) {
    const state = getState().lessons;
    const securityState = getState().security;

    let userAnswerTextFinalized = userAnswerText;
    let userCorrectFinalized = null;
    if (typeof userAnswerText === 'boolean') {
      userAnswerTextFinalized = null;
      userCorrectFinalized = userAnswerText;
    } else {
      userCorrectFinalized = state.currentQuestion.correctAlternative.some(s =>
        s.some(so => so.toLowerCase() === userAnswerTextFinalized.toLowerCase())
      );
    }

    const answeredQuestion = {
      ...state.currentQuestion,
      cardData,
      userAnswer: userAnswerTextFinalized,
      userCorrect: userCorrectFinalized
    };

    if (answeredQuestion.userCorrect) {
      dispatch(receiveCorrectAttempt());
    } else {
      dispatch(receiveIncorrectAttempt());
    }
    const eventData = {
      page: 'lessons',
      username: securityState.loggedInUser,
      lesson: state.selectedLesson.name,
      data: [
        {
          eventType: 'userAnswer',
          eventData: userAnswerText,
          nuggetId: null
        },
        {
          eventType: 'correctAlternative',
          eventData: state.currentQuestion.shapes[0],
          nuggetId: state.currentQuestion.correctAlternativeNuggetId
        },
        {
          eventType: 'correctAlternative',
          eventData: state.currentQuestion.correctAlternative[0],
          nuggetId: state.currentQuestion.correctAlternativeNuggetId
        },
        {
          eventType: 'answeredCorrectly',
          eventData: answeredQuestion.userCorrect,
          nuggetId: state.currentQuestion.correctAlternativeNuggetId
        }
      ],
      nuggetcategory: state.playtype
    };

    if (getState().lessons.spacedRepetition) {
      eventData.data.push({
        eventType: 'updateRetention',
        eventData: answeredQuestion.userCorrect,
        nuggetId: state.currentQuestion.correctAlternativeNuggetId
      });
    }

    dispatch({
      type: ADD_USER_ANSWER,
      description: 'Add an answer a user made, along with correct results',
      answeredQuestion
    });

    dispatch(calcLessonSuccessRate());
    dispatch(calcAnswerButtonStyles(userAnswerText));

    return Utility.logEvents(eventData, true);
  };
}

export function clearUserAnswers() {
  return {
    type: CLEAR_USER_ANSWERS,
    description: 'Clear user answer history'
  };
}

export function resetAttempts() {
  return function(dispatch) {
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

export function setAnswerTextInputFocusedState(focused) {
  return {
    type: SET_ANSWER_TEXT_INPUT_FOCUSED_STATE,
    description: 'Allow or disallow focus for answer input field',
    answerTextInputFocused: focused
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

export function receiveProcessedQuestion(currentQuestion) {
  return function(dispatch, getState) {
    const securityState = getState().security;

    dispatch({
      type: RECEIVE_PROCESSED_QUESTION,
      description: 'We have received the next question, randomized and processed for play',
      currentQuestion
    });

    try {
      Utility.logEvent(
        'lessons',
        'question',
        currentQuestion.shapes,
        currentQuestion.correctAlternativeNuggetId,
        securityState.loggedInUser
      );
      for (let i = 0; i < currentQuestion.randomizedAlternatives.length; i += 1) {
        Utility.logEvent(
          'lessons',
          'alternative',
          currentQuestion.randomizedAlternatives[i],
          null,
          securityState.loggedInUser
        );
      }
      Utility.sendCollectedEvents().catch(() => {
        // Failed to send event data, log us out.
        this.props.requestUserLogout(this.props.location.query.currentUrl || '/', getCSRF());
      });
    } catch (err) {
      this.props.requestUserLogout(this.props.location.query.currentUrl || '/', getCSRF());
    }
  };
}

export function processCurrentQuestion() {
  return function(dispatch, getState) {
    const state = getState().lessons;
    const localQuestionIndex = state.currentQuestionIndex;

    const questionArray = [];
    questionArray[0] = state.questions[localQuestionIndex].correctAlternative[0].map(s => s);
    questionArray[1] = state.questions[localQuestionIndex].alternative1.map(s => s);
    if (state.questions[localQuestionIndex].alternative2) {
      questionArray[2] = state.questions[localQuestionIndex].alternative2.map(s => s);
    }
    if (state.questions[localQuestionIndex].alternative3) {
      questionArray[3] = state.questions[localQuestionIndex].alternative3.map(s => s);
    }

    const currentQuestion = {
      shapes: state.questions[localQuestionIndex].question.map(s => s),
      correctAlternative: state.questions[localQuestionIndex].correctAlternative.map(s => s.map(so => so)),
      correctAlternativeNuggetId: state.questions[localQuestionIndex].questionNuggetId,
      randomizedAlternatives: Utility.randomizeOrder(questionArray),
      buttonStyles: ['default', 'default', 'default', 'default'],
      buttonsDisabled: false,
      resourceRef: state.questions[localQuestionIndex].resourceReference || null,
      explanationText: state.questions[localQuestionIndex].explanationText || null
    };

    dispatch(receiveProcessedQuestion(currentQuestion));
  };
}

export function resetQuestionIndex() {
  return {
    type: RESET_QUESTION_INDEX,
    description: 'Reset the question index'
  };
}

export function setSelectedLesson(lesson) {
  return {
    type: SET_SELECTED_LESSON,
    description: 'Set the selected lesson name',
    lesson
  };
}

export function setAddressedQuestions(response) {
  return {
    type: SET_ADDRESSED_QUESTIONS,
    description: 'Set the addressed questions',
    response
  };
}

export function receiveUserSuccessRate(successRate, status, response) {
  return {
    type: RECEIVE_USER_SUCCESS_RATE,
    description: 'Received user success rate',
    successRate,
    status,
    response,
    lastReceived: Date.now()
  };
}

export function receiveUserStarredLessons(result) {
  return {
    type: RECEIVE_USER_STARRED_LESSONS,
    description: 'Recieved user starred lessons',
    result
  };
}

export function receiveFavoriteLesson(lesson) {
  return {
    type: RECEIVE_FAVORITE_LESSON,
    description: 'Received favorite lesson',
    lesson
  };
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
  return function(dispatch) {
    dispatch(resetAttempts());
    dispatch(resetQuestionIndex());
    dispatch(clearUserAnswers());
    dispatch(setAllButtonsDisabledState(false));
  };
}

export function receiveLessons(newLessons) {
  return function(dispatch) {
    dispatch({
      type: SET_LESSONS,
      description: 'Manually set lesson names. Temporary function.',
      lessons: newLessons
    });
  };
}

export function setQuestionLanguage(language) {
  return function(dispatch) {
    dispatch({
      type: SET_QUESTION_LANGUAGE,
      description: 'Set the question language',
      language
    });
  };
}

export function setAnswerLanguage(language) {
  return function(dispatch) {
    dispatch({
      type: SET_ANSWER_LANGUAGE,
      description: 'Set the question language',
      language
    });
  };
}

export function setKanjiDifficulty(difficulty) {
  return function(dispatch) {
    dispatch({
      type: SET_KANJI_DIFFICULTY,
      description: 'Set the kanji writing difficulty',
      difficulty
    });
  };
}

export function fetchLessons(type) {
  return function(dispatch, getState) {
    const lessonState = getState().lessons;
    const url = type === 'quiz' ? '/api/quizes' : `/api/lessons?lessonType=${type}`;
    return fetch(url, { credentials: 'same-origin' })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error();
      })
      .then(result => {
        dispatch(receiveLessons(result));
        if (
          !lessonState.selectedLesson.name ||
          lessonState.selectedLesson.name === '' ||
          result.every(element => element.name !== lessonState.selectedLesson.name)
        ) {
          dispatch(setSelectedLesson(result[0]));
        }
      });
  };
}

export function fetchaddressedQuestionsInLessons(type) {
  return function(dispatch, getState) {
    const username = getState().security.loggedInUser;
    return fetch(`/api/lessonInfo?username=${username}&lessonType=${type}`, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(result => dispatch(setAddressedQuestions(result)));
  };
}

export function fetchLesson(lessonType) {
  return function(dispatch, getState) {
    let fetchURL;
    switch (lessonType) {
      case 'quiz':
        fetchURL = '/api/quiz';
        break;
      case 'kanji':
        fetchURL = '/api/questions/kanji';
        break;
      default:
        fetchURL = '/api/questions';
        break;
    }

    const lessonState = getState().lessons;
    const securityState = getState().security;

    dispatch({
      type: SET_FETCHING_LESSON,
      description: 'A lesson has been requested.',
      value: true
    });

    return new Promise(resolve =>
      fetch(
        `${fetchURL}?lessonName=${lessonState.selectedLesson.name}&questionType=${lessonState.questionType}&` +
          `answerType=${lessonState.answerType}&lessonType=${lessonType}&username=${
            securityState.loggedInUser
          }&spacedRepetition=${lessonState.spacedRepetition}`,
        { credentials: 'same-origin' }
      )
        .then(response => response.json())
        .then(json => {
          dispatch(resetLesson());
          dispatch(receiveLesson(json));
          dispatch(processCurrentQuestion());
          dispatch({
            type: SET_FETCHING_LESSON,
            description: 'The requested lesson has been retrieved successfully.',
            value: false
          });
          resolve();
        })
    );
  };
}

//hämtar de felsvarade frågorna från backend
export function fetchLessonIncorrectAnswers(lessonType) {
  return function(dispatch, getState) {
    let fetchURL;
    switch (lessonType) {
      case 'kanji':
        fetchURL = '/api/wrongquestions/kanji';
        break;
      default:
        fetchURL = '/api/wrongquestions';
        break;
    }
    const lessonState = getState().lessons;
    const securityState = getState().security;

    dispatch({
      type: SET_FETCHING_LESSON,
      description: 'A lesson has been requested.',
      value: true
    });

    return new Promise(resolve =>
      fetch(
        `${fetchURL}?lessonType=${lessonState.lessonType}&questionType=${lessonState.questionType}&answerType=${
          lessonState.answerType
        }&userName=${securityState.loggedInUser}`,
        { credentials: 'same-origin' }
      )
        .then(response => {
          if (response.ok) {
            return response[response.status === 204 ? 'text' : 'json']();
          }
        })
        .then(json => {
          //när man får frågor en användare har svarat fel på
          if (json !== '') {
            dispatch(resetLesson());
            dispatch(receiveLesson(json));
            dispatch(processCurrentQuestion());
            dispatch({
              type: SET_FETCHING_LESSON,
              description: 'The requested lesson has been retrieved successfully.',
              value: false
            });
            resolve();
          } else {
            //vad ska hända när den är tom
            dispatch({
              type: SET_FETCHING_LESSON,
              description: 'The requested lesson has been retrieved successfully but is empty.',
              value: false
            });
          }
        })
    );
  };
}

export function fetchFavoriteLesson(lessonType) {
  return function(dispatch, getState) {
    const securityState = getState().security;
    return fetch(`/api/lessons/favorite?username=${securityState.loggedInUser}&lessonType=${lessonType}`, {
      credentials: 'same-origin'
    })
      .then(response => response.json())
      .then(result => dispatch(receiveFavoriteLesson(result)));
  };
}

export function fetchUserStarredLessons() {
  return function(dispatch, getState) {
    const securityState = getState().security;
    return fetch(`/api/userLessons?username=${securityState.loggedInUser}`, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(result => dispatch(receiveUserStarredLessons(result)));
  };
}

export function addStarredLesson(lessonName, lessonType) {
  return function(dispatch, getState) {
    const xsrfTokenValue = getCSRF();
    const securityState = getState().security;
    fetch(`/api/userLessons/add?lessonName=${lessonName}&username=${securityState.loggedInUser}`, {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': xsrfTokenValue
      }
    })
      .then(() => dispatch(fetchUserStarredLessons()))
      .then(() => dispatch(fetchFavoriteLesson(lessonType)));
  };
}

export function removeStarredLesson(lessonName, lessonType) {
  return function(dispatch, getState) {
    const xsrfTokenValue = getCSRF();
    const securityState = getState().security;
    fetch(`/api/userLessons/remove?lessonName=${lessonName}&username=${securityState.loggedInUser}`, {
      credentials: 'same-origin',
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': xsrfTokenValue
      }
    })
      .then(() => dispatch(fetchUserStarredLessons()))
      .then(() => dispatch(fetchFavoriteLesson(lessonType)));
  };
}

export function fetchUserSuccessRate(username) {
  return function(dispatch) {
    dispatch(requestUserSuccessRate());

    fetch(`/api/statistics/${username}`, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(data => dispatch(receiveUserSuccessRate(data, 'success', data)));
  };
}

export function toggleSpacedRepetition() {
  return function(dispatch, getState) {
    const lessonState = getState().lessons;
    dispatch({
      type: SET_SPACED_REPETITION,
      description: 'Toggles spaced repetition',
      value: !lessonState.spacedRepetition
    });
  };
}

export function addUserKanjiDrawing(drawURL) {
  return function(dispatch, getState) {
    const xsrfTokenValue = getCSRF();
    const securityState = getState().security;
    const body = JSON.stringify({
      timestamp: Number(new Date()),
      nuggetid: getState().lessons.currentQuestion.correctAlternativeNuggetId,
      username: securityState.loggedInUser,
      data: drawURL,
      difficulty: getState().lessons.kanjiDifficulty
    });

    fetch(`/api/kanji-drawings`, {
      credentials: 'same-origin',
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': xsrfTokenValue
      }
    });
  };
}

export function setFetchingLesson(value) {
  return function(dispatch) {
    dispatch({
      type: SET_FETCHING_LESSON,
      description: 'The requested lesson has been retrieved successfully.',
      value
    });
  };
}
export function fetchIncorrectLessonCount(lessonType) {
  return function(dispatch, getState) {
    const securityState = getState().security;

    return fetch(`/api/lessons/incorrectcount?username=${securityState.loggedInUser}&lessonType=${lessonType}`, {
      credentials: 'same-origin'
    })
      .then(response => response.json())
      .then(result => dispatch(receiveIncorrectLessonCount(result)));
  };
}

export function receiveIncorrectLessonCount(count) {
  return {
    type: RECEIVE_INCORRECT_LESSON_COUNT,
    description: 'Received incorrect lesson count',
    count
  };
}
export function setPlayType(playtype) {
  return {
    type: SET_LESSON_PLAY_TYPE,
    description: 'Set lesson type',
    playtype
  };
}

export function fetchQuizImage(correctAnswer) {
  return function(dispatch) {
    return fetch(`/api/quiz/nugget/correctAnswer/${correctAnswer}`, {
      credentials: 'same-origin'
    })
      .then(response => response.json())
      .then(result => dispatch(setQuizImage(result.quizImage)));
  };
}

export function setQuizImage(quizImage) {
  return {
    type: SET_QUIZ_IMAGE,
    description: 'Set quiz image',
    quizImage
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
  fetchLessonIncorrectAnswers,
  fetchLessons,
  fetchaddressedQuestionsInLessons,
  fetchFavoriteLesson,
  setSelectedLesson,
  setGameMode,
  processCurrentQuestion,
  setAllButtonsDisabledState,
  setAnswerTextInputFocusedState,
  addUserAnswer,
  clearUserAnswers,
  resetAttempts,
  calcAnswerButtonStyles,
  resetLesson,
  receiveLessons,
  receiveFavoriteLesson,
  setQuestionLanguage,
  setAnswerLanguage,
  fetchUserStarredLessons,
  receiveUserStarredLessons,
  addStarredLesson,
  removeStarredLesson,
  toggleSpacedRepetition,
  setKanjiDifficulty,
  addUserKanjiDrawing,
  fetchIncorrectLessonCount,
  setPlayType,
  fetchQuizImage,
  setQuizImage
};

// ----------------
// REDUCER - For a given state and action, returns the new state.
// To support time travel, this must not mutate the old state.
export function lessons(state = defaultState, action) {
  // Special case of redux-persist
  if (action.type === REHYDRATE) {
    const incoming = action.payload.lessons;
    // Don't use the rehydrated state for now
    if (incoming) return { ...state };
    // if (incoming) return { ...state, ...incoming/* , specialKey: processSpecial(incoming.specialKey)*/ };
    return state;
  }

  switch (action.type) {
    default:
      return state || defaultState;
    case SET_ALL_BUTTONS_DISABLED_STATE:
      return {
        ...state,
        allButtonsDisabled: action.allButtonsDisabled
      };
    case SET_ANSWER_TEXT_INPUT_FOCUSED_STATE:
      return {
        ...state,
        answerTextInputFocused: action.answerTextInputFocused
      };
    case CLEAR_PROCESSED_QUESTION:
      return {
        ...state,
        currentQuestion: {
          shapes: [],
          correctAlternative: [],
          randomizedAlternatives: [],
          buttonStyles: ['default', 'default', 'default', 'default'],
          buttonsDisabled: false,
          resourceRef: []
        }
      };
    case RECEIVE_ANSWER_BUTTON_STYLES:
      return {
        ...state,
        currentQuestion: { ...state.currentQuestion, buttonStyles: action.buttonStyles }
      };
    case ADD_USER_ANSWER:
      return {
        ...state,
        answeredQuestions: [...state.answeredQuestions, action.answeredQuestion]
      };
    case CLEAR_USER_ANSWERS:
      return {
        ...state,
        answeredQuestions: [],
        currentProcessedQuestionAnswered: false,
        currentProcessedQuestionAnsweredCorrectly: false
      };
    case RECEIVE_LESSON:
      return {
        ...state,
        questions: action.questions,
        lessonLength: action.questions.length
      };
    case SET_LESSONS:
      return {
        ...state,
        lessons: action.lessons
      };
    case SET_GAMEMODE:
      return {
        ...state,
        gamemode: action.gamemode
      };
    case RECEIVE_PROCESSED_QUESTION:
      return {
        ...state,
        currentQuestion: action.currentQuestion,
        resourceRef: action.currentQuestion.resourceRef,
        currentProcessedQuestionAnswered: false,
        currentProcessedQuestionAnsweredCorrectly: false
      };
    case RECEIVE_FAVORITE_LESSON:
      return {
        ...state,
        favoriteLesson: action.lesson
      };
    case SET_SELECTED_LESSON:
      return {
        ...state,
        selectedLesson: action.lesson || { name: '' }
      };
    case SET_ADDRESSED_QUESTIONS:
      return {
        ...state,
        addressedQuestionsInLessons: action.response
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
    case RECEIVE_USER_STARRED_LESSONS:
      return {
        ...state,
        starredLessons: action.result
      };
    case REQUEST_USER_SUCCESS_RATE:
      return {
        ...state,
        requestingSuccessRate: true
      };
    case SET_SPACED_REPETITION:
      return {
        ...state,
        spacedRepetition: action.value
      };
    case SET_KANJI_DIFFICULTY:
      return {
        ...state,
        kanjiDifficulty: action.difficulty
      };
    case SET_FETCHING_LESSON:
      return {
        ...state,
        isFetchingLesson: action.value
      };
    case RECEIVE_INCORRECT_LESSON_COUNT:
      return {
        ...state,
        incorrectAnsweredLesson: action.count
      };
    case SET_LESSON_PLAY_TYPE:
      return {
        ...state,
        playtype: action.playtype
      };
    case SET_QUIZ_IMAGE:
      return {
        ...state,
        quizImage: action.quizImage
      };
  }
}

export const reducers = {
  lessons
};
