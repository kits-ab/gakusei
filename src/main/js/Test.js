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
  test: 0
};

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export const INCREASE = 'INCREASE';

export function increase() {
  return function (dispatch, getState) {
    dispatch({
      type: INCREASE,
      description: 'Set lesson success rate'
    });
  };
}

export const actionCreators = {
  increase
};

// ----------------
// REDUCER - For a given state and action, returns the new state.
// To support time travel, this must not mutate the old state.
export const reducerx = (state, action) => {
  switch (action.type) {
    default:
      return state || defaultState;
    case INCREASE:
      return {
        ...state,
        test: state.test + 1
      };
  }
};

export const reducers = {
  reducerx
};

// Not needed since we only have 1 reducer..?
// const randomStore = combineReducers({
//   reducer
// });
