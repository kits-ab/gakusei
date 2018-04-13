// ----------------
// DEFAULT STATE
export const defaultState = {
  successRate: 0
};

// ----------------
// PROPTYPES
export const propTypes = {
  successRate: PropTypes.number.isRequired
};

// -----------------
// ACTION CONSTANTS - Just used to differentiate the "actions"
export const RECEIVE_USER_SUCCESS_RATE = 'RECEIVED_USER_SUCCESS_RATE';
export const REQUEST_USER_SUCCESS_RATE = 'REQUEST_USER_SUCCESS_RATE';

// -----------------
// ACTION (CREATORS) - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.
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

export function requestUserSuccessRate() {
  return {
    type: REQUEST_USER_SUCCESS_RATE,
    description: 'We are requesting success rate'
  };
}

export const actionCreators = {
  receiveUserSuccessRate,
  requestUserSuccessRate
};

// ----------------
// REDUCER - For a given state and action, returns the new state.
// To support time travel, this must not mutate the old state.
export function statistics(state = defaultState, action) {
  switch (action.type) {
    default:
      return state || defaultState;
    case REQUEST_USER_SUCCESS_RATE:
      return {
        ...state,
        requestingSuccessRate: true
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
  }
}

export const reducers = {
  statistics
};
