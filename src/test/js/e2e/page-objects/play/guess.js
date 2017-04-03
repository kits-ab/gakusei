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
      answerButtons: 'button.answerbutton:not([disabled])',
      button1: `button.answerbutton[name="answerbutton-${1}"]:not([disabled])`,
      button2: `button.answerbutton[name="answerbutton-${2}"]:not([disabled])`,
      button3: `button.answerbutton[name="answerbutton-${3}"]:not([disabled])`,
      button4: `button.answerbutton[name="answerbutton-${4}"]:not([disabled])`,
      tryAgainButton: 'button.tryAgainButton:not([disabled])',

      playPageCheckValue: 'button.answerbutton:not([disabled])',
      finishPageCheckValue: 'button.tryAgainButton:not([disabled])'
    },

    props: {
      buttonDelay: 250,
      answerButtonNumber: 1
    },

    commands: [
      {
        // This loop gets executed in the playUntilFinish() function call
        playLoop() {
          this.clickAnswerButton();
          this.props.answerButtonNumber = (this.props.answerButtonNumber % 4) + 1;
        },

        clickAnswerButton(buttonNumber) {
          const determinedButtonNumber = buttonNumber || Math.floor(Math.random() * 4) + 1;

          this.waitForElementVisible(this.elements[`button${determinedButtonNumber}`].selector)
        .api.pause(this.props.buttonDelay);
          this.click(this.elements[`button${determinedButtonNumber}`].selector);
          return this;
        }
      }
    ]
  });

  return theConfig;
};

module.exports = createPageObject();
