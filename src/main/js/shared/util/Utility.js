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
    return Object.assign({}, propTypes, Utility.generatePropsFromReducer(reducerNames));
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
// FORM-RELATED

  static getFormData(form) {
    return Object.keys(form.target).map(key => (
      form.target[key].value ?
      `${encodeURIComponent(form.target[key].name)}=${encodeURIComponent(form.target[key].value)}`
       : null
      )).filter(val => val);
  }

// ----------------
// LOGGING
  static logEvent(page, eventType, eventData, nuggetId, username) {
    return new Promise((resolve, reject) => {
      const promises = [];
      if (Array.isArray(eventData)) {
        for (let i = 0; i < eventData.length; i += 1) {
          promises.push(this.postEvent(page, eventType, eventData[i], nuggetId, username)
          .catch((err) => { reject(err); }));
        }
      } else {
        promises.push(this.postEvent(page, eventType, eventData, nuggetId, username)
        .catch((err) => { reject(err); }));
      }

      Promise.all(promises).then((values) => {
        if (values.some(response => !response.ok)) {
          reject();
        } else { resolve(); }
      });
    });
  }

  static postEvent(page, eventType, eventData, nuggetId, username) {
    const bodyData = {
      timestamp: Number(new Date()),
      gamemode: page,
      type: eventType,
      data: eventData,
      nuggetid: nuggetId,
      username
    };
    const xsrfTokenValue = getCSRF();
    return fetch('/api/events',
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
