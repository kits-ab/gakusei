import { combineReducers } from 'redux';
import 'whatwg-fetch';

// import { INCREMENT_HEIGHT, INCREMENT_WIDTH, INCREMENT_COUNT } from './actions';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export const INCREMENT_HEIGHT = 'INCREMENT_HEIGHT';
export const INCREMENT_WIDTH = 'INCREMENT_WIDTH';
export const INCREMENT_COUNT = 'INCREMENT_COUNT';

export function incrementHeight() {
  return {
    type: INCREMENT_HEIGHT,
    description: 'Increment the height' };
}

export function incrementWidth() {
  return {
    type: INCREMENT_WIDTH,
    description: 'Increment the width' };
}
export function incrementCount() {
  return {
    type: INCREMENT_COUNT,
    description: 'Increment the count' };
}
export function fetchPosts(subreddit) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(incrementHeight());

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then(response => response.json())
      .then(json => console.log(json)

        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        // dispatch(receivePosts(subreddit, json))
      );

      // In a real world app, you also want to
      // catch any error in the network call.
  };
}

export const actionCreators = {
  incrementHeight,
  incrementWidth,
  incrementCount,
  fetchPosts
};

// ----------------
// REDUCER - For a given state and action, returns the new state.
// To support time travel, this must not mutate the old state.
export const reducer = (state, action) => {
  switch (action.type) {
    default:
      return state || { height: 250,
        width: 250,
        count: 0 };
    case INCREMENT_HEIGHT:
      return {
        ...state,
        height: state.height + 150
      };
    case INCREMENT_WIDTH:
      return {
        ...state,
        width: state.width + 50
      };
    case INCREMENT_COUNT:
      return {
        ...state,
        count: state.count + 1
      };
  }
};

// Not needed since we only have 1 reducer
// const randomStore = combineReducers({
//   reducer
// });
