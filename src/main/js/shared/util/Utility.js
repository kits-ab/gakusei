import { connect } from 'react-redux';
import getCSRF from './getcsrf';

export default class Utility {
  // ----------------
  // REDUX RELATED - Helps return various redux objects
  static generatePropsFromReducer(reducers) {
    let result = {};
    reducers.forEach(reducer => {
      const dynamicPropTypes = {};
      Object.keys(reducer.actionCreators).forEach(x => {
        dynamicPropTypes[x] = PropTypes.func.isRequired;
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
    reducers.forEach(reducer =>
      result.push({
        ...(reducer.defaultState || reducer.defaultProps)
      })
    );

    return result;
  }

  static generateReducerNamesFromReducer(reducers) {
    const result = [];
    reducers.forEach(reducer =>
      Object.keys(reducer.reducers).forEach(x => {
        result.push(x);
      })
    );
    return result;
  }

  static generateActionCreatorsFromReducer(reducers) {
    const result = [];
    reducers.forEach(reducer => result.push(reducer.actionCreators));
    return result;
  }

  static reduxEnabledDefaultProps(defaultProps, reducerNames) {
    return Object.assign({}, defaultProps, ...Utility.generateDefaultPropsFromReducer(reducerNames));
  }

  static reduxEnabledPropTypes(propTypes, reducerNames) {
    return Object.assign({}, propTypes, Utility.generatePropsFromReducer(reducerNames));
  }

  static superConnect(sender, reducerNames) {
    return connect(
      // Selects which state properties are merged into the component's props
      state =>
        Object.assign(
          {},
          ...Utility.generateReducerNamesFromReducer(reducerNames).map(reducerStateName => state[reducerStateName])
        ),
      // Selects which action creators are merged into the component's props
      Object.assign({}, ...Utility.generateActionCreatorsFromReducer(reducerNames))
    );
  }

  // ----------------
  // FORM-RELATED

  static getFormData(form) {
    return Object.keys(form.target)
      .map(
        key =>
          form.target[key].value
            ? `${encodeURIComponent(form.target[key].name)}=${encodeURIComponent(form.target[key].value)}`
            : null
      )
      .filter(val => val);
  }

  // ----------------
  // LOGGING
  static collectedEvents = [];

  static logEvent(page, eventType, eventData, nuggetId, username, lesson, sendImmediately = false) {
    // Because sometimes we log a phonetic and a traditional written version of the same word
    // We log both of these separately to the back-end using the below evaluation
    const pushFunc = eventDataValue => {
      this.collectedEvents.push({
        timestamp: Number(new Date()),
        gamemode: page,
        type: eventType,
        data: eventDataValue,
        nuggetid: nuggetId,
        username,
        lesson
      });
    };

    if (Array.isArray(eventData)) {
      eventData.forEach(value => pushFunc(value));
    } else {
      pushFunc(eventData);
    }

    if (sendImmediately) {
      return this.sendCollectedEvents();
    }
    return null;
  }

  static logEvents(logData, sendImmediately) {
    for (let i = 0; i < logData.data.length; i++) {
      this.logEvent(
        logData.page,
        logData.data[i].eventType,
        logData.data[i].eventData,
        logData.data[i].nuggetId,
        logData.username,
        logData.lesson
      );
    }

    if (sendImmediately) {
      return this.sendCollectedEvents();
    }
    return null;
  }

  static sendCollectedEvents() {
    const xsrfTokenValue = getCSRF();
    const body = JSON.stringify(this.collectedEvents);
    this.collectedEvents = []; // Clear the data
    return fetch('/api/events2', {
      credentials: 'same-origin',
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': xsrfTokenValue
      }
    });
  }

  // Deprecated
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
    return fetch('/api/events', {
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
