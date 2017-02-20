import 'whatwg-fetch';
// For temporary page management
import React from 'react';
import { browserHistory } from 'react-router';
import { push } from 'react-router-redux';

import Utility from './util/Utility';

// ----------------
// DEFAULT STATE
export const defaultState = {
  test: 0
};

// -----------------
// ACTION CONSTANTS - Just used to differentiate the "actions"
export const INCREASE = 'INCREASE';


// -----------------
// ACTION (CREATORS) - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.
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
export const testing = (state, action) => {
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
  testing
};
