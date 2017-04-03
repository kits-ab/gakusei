/* eslint-disable no-console */

const merge = require('webpack-merge');
const base = require('./base');

const createPageObject = () => {
  const theConfig = merge({
    customizeArray(a, b, key) {
      if (key === 'commands') {
        const result = [Object.assign({}, b[0], a[0])];
        return result;
      }

      // Fall back to default merging
      return undefined;
    }
  })(base, {
  // can be string or function
    url() {
      return `${this.api.launchUrl}/play/${this.name}`;
    },

    elements: {
      textInput: 'input[name="translateText"]:not([disabled])',
      submitAnswerButton: 'button[type="submit"]:not([disabled])',
      tryAgainButton: 'button.tryAgainButton:not([disabled])',

      playPageCheckValue: 'button[type="submit"]:not([disabled])',
      finishPageCheckValue: 'button.tryAgainButton:not([disabled])'
    },

    props: {
      buttonDelay: 250
    },

    commands: [
      {
        // This loop gets executed in the playUntilFinish() function call
        playLoop() {
          this.clickAnswerButton();
        },

        clickAnswerButton(answerText) {
          const determinedAnswerText = answerText || 'ABC';

          this.waitForElementVisible('@textInput')
            .setValue('@textInput', determinedAnswerText)
            .api.pause(this.props.buttonDelay);
          this.click('@submitAnswerButton');
          return this;
        }
      }
    ]
  });

  return theConfig;
};

module.exports = createPageObject();
