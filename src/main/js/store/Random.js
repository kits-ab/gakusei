import { Action, Reducer } from 'redux';
// -----------------
// STATE - This defines the type of data maintained in the Redux store.

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
  increment_height: () => { 'INCREMENT_HEIGHT'; },
  increment_width: () => { 'INCREMENT_WIDTH'; },
  increment_count: () => { 'INCREMENT_COUNT'; }
};
// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
export const reducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT_HEIGHT':
      return {
        height: state.height + 50,
        width: state.width,
        count: state.count
      };
    case 'INCREMENT_WIDTH':
      return {
        height: state.height,
        width: state.width + 50,
        count: state.count
      };
    case 'INCREMENT_COUNT':
      return {
        height: state.height,
        width: state.width,
        count: state.count + 1
      };
    default:
      break;
    // default:
    //   const exhaustiveCheck = action;
    //   // The following line guarantees that every action in the KnownAction union has been covered by a case above
  }
    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
  return state || { height: 250,
    width: 250,
    count: 0 };
};
