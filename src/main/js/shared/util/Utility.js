import React from 'react';
import { connect } from 'react-redux';
import getCSRF from './getcsrf';

export default class Utility {

// ----------------
// REDUX RELATED - Helps return various redux objects
  static generatePropsFromReducer(reducers) {
    let result = {};
    reducers.forEach((reducer) => {
      const dynamicPropTypes = {};
      Object.keys(reducer.actionCreators).forEach((x) => {
        dynamicPropTypes[x] = React.PropTypes.func.isRequired;
      });

      result = {
        ...result,
        ...dynamicPropTypes,
        ...reducer.propTypes
      };
    });

    return result;
  }

  static generateDefaultPropsFromReducer(reducers) {
    const result = [];
    reducers.forEach(reducer => (result.push({
      ...(reducer.defaultState || reducer.defaultProps)
    })));

    return result;
  }

  static generateReducerNamesFromReducer(reducers) {
    const result = [];
    reducers.forEach(reducer =>
      Object.keys(reducer.reducers).forEach((x) => {
        result.push(x);
      })
  );
    return result;
  }

  static generateActionCreatorsFromReducer(reducers) {
    const result = [];
    reducers.forEach(reducer =>
      result.push(reducer.actionCreators)
  );
    return result;
  }

  static reduxEnabledDefaultProps(defaultProps, reducerNames) {
    return Object.assign({},
    defaultProps,
    ...Utility.generateDefaultPropsFromReducer(reducerNames)
    );
  }

  static reduxEnabledPropTypes(propTypes, reducerNames) {
    const test = Object.assign({}, propTypes, Utility.generatePropsFromReducer(reducerNames));

    return test;
  }

  static superConnect(sender, reducerNames) {
    return connect(
      // Selects which state properties are merged into the component's props
      state => (
        Object.assign({},
          ...Utility.generateReducerNamesFromReducer(reducerNames)
            .map(reducerStateName => state[reducerStateName])
        )
      ),
      // Selects which action creators are merged into the component's props
      (Object.assign({}, ...Utility.generateActionCreatorsFromReducer(reducerNames))),
    );
  }

// ----------------
// MISC
  static logEvent(page, eventType, eventData, username) {
    if (Array.isArray(eventData)) {
      for (let i = 0; i < eventData.length; i += 1) {
        this.postEvent(page, eventType, eventData[i], username);
      }
    } else {
      this.postEvent(page, eventType, eventData, username);
    }
  }

  static postEvent(page, eventType, eventData, username) {
    const bodyData = {
      timestamp: Number(new Date()),
      gamemode: page,
      type: eventType,
      data: eventData,
      username
    };
    const xsrfTokenValue = getCSRF();
    fetch('/api/events',
      {
        credentials: 'same-origin',
        method: 'POST',
        body: JSON.stringify(bodyData),
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': xsrfTokenValue
        }
      });
  }

  static randomizeOrder(array) {
    const newArray = array.slice();
    for (let i = newArray.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = newArray[i];
      newArray[i] = newArray[j];
      newArray[j] = temp;
    }
    return newArray;
  }
}
