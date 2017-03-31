/* eslint-disable no-console */

const merge = require('webpack-merge');
const base = require('./base');

// enhanced page object

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
      flipCardButton: 'button.flipCardButton:not([disabled])',
      answerButtons: 'button.answerbutton:not([disabled])',
      yesAnswerButton: 'button.answerbutton[name="answerbutton-1"]:not([disabled])',
      noAnswerButton: 'button.answerbutton[name="answerbutton-2"]:not([disabled])',
      tryAgainButton: 'button.tryAgainButton:not([disabled])',

      playPageCheckValue: 'button.flipCardButton:not([disabled])',
      finishPageCheckValue: 'button.tryAgainButton:not([disabled])'
    },

    props: {
      buttonDelay: 250,
      answerYes: false
    },

    commands: [
      {
        // This loop gets executed in the playUntilFinish() function call
        playLoop() {
          this.flipCard();
          this.props.answerYes = !this.props.answerYes;
          if (this.props.answerYes) { this.clickYes(); } else { this.clickNo(); }
        },

        flipCard(skipWait = false) {
          (skipWait ? this : this.waitForElementVisible('@flipCardButton'))
        .api.pause(this.props.buttonDelay);
          this.click('@flipCardButton');
          return this;
        },

        clickYes() {
          this.waitForElementVisible('@yesAnswerButton')
        .api.pause(this.props.buttonDelay);
          this.click('@yesAnswerButton');
          return this;
        },

        clickNo() {
          this.waitForElementVisible('@noAnswerButton')
        .api.pause(this.props.buttonDelay);
          this.click('@noAnswerButton');
          return this;
        },

        clickYesOrNo() {
          this.waitForElementVisible('@answerButtons')
        .api.pause(this.props.buttonDelay);
          this.api.elements('css selector', this.elements.answerButtons.selector, (foundElements) => {
            this.api.elementIdClick(
              foundElements.value[Math.floor(Math.random() * foundElements.value.length)].ELEMENT);
          });
          return this;
        }
      }
    ]
  });

  return theConfig;
};

module.exports = createPageObject();
