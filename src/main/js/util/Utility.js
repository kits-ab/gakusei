import getCSRF from './getcsrf';

export default class Utility {

  static getSuccessRate() {
    let successRate = 0;
    let successRateMessage = '';
    const emojiFeedback = {
      veryBad: String.fromCodePoint(0x1F61E),
      bad: String.fromCodePoint(0x1F615),
      average: String.fromCodePoint(0x1F610),
      good: String.fromCodePoint(0x1F642),
      veryGood: String.fromCodePoint(0x1F600)
    };
    if (Number(sessionStorage.totalAttempts) > 0) {
      successRate = (Number(sessionStorage.correctAttempts) / Number(sessionStorage.totalAttempts)) * 100;
      successRateMessage = `${successRate.toFixed(0)} %`;
      if (successRate >= 80) {
        return `, ${successRateMessage} ${emojiFeedback.veryGood}`;
      } else if (successRate < 80 && successRate >= 60) {
        return `, ${successRateMessage} ${emojiFeedback.good}`;
      } else if (successRate < 60 && successRate >= 40) {
        return `, ${successRateMessage} ${emojiFeedback.average}`;
      } else if (successRate < 40 && successRate >= 20) {
        return `, ${successRateMessage} ${emojiFeedback.bad}`;
      } else if (successRate < 20) {
        return `, ${successRateMessage} ${emojiFeedback.veryBad}`;
      }
    }
    return successRateMessage;
  }

  static logEvent(page, eventType, eventData, username) {
    const dataString = Array.isArray(eventData) ? eventData.join('|') : eventData;
    const bodyData = {
      'timestamp': Number(new Date()),
      'gamemode': page,
      'type': eventType,
      'data': dataString,
      'username': username
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
}
