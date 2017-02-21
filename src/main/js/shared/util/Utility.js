/* global fetch sessionStorage */

import getCSRF from './getcsrf';

export default class Utility {

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
