/* eslint-disable no-console */

module.exports = {
  // can be string or function
  props: {
    buttonDelay: 250
  },

  commands: [
    {
      /* returns true or false */
      areWeFinished(callback) {
        this.waitForElementVisible(`
        ${this.elements.playPageCheckValue.selector}, 
        ${this.elements.finishPageCheckValue.selector}`, () =>
          this.api.pause(this.props.buttonDelay)
          .elements(
            'css selector',
            this.elements.finishPageCheckValue.selector,
            foundElements => callback(foundElements.value.length > 0)
          )
        );
      },

      playUntilFinish() {
        const looper = () => {
          let continueLooping = null;
          /* eslint-disable no-return-assign */
          this.areWeFinished(finished => continueLooping = !finished);
          this.api.perform(() => {
            console.log(continueLooping);
            if (continueLooping === true) {
                // actual interaction logic
              this.playLoop();
              looper();
            }
          });
        };
        looper();
        return this;
      }
    }
  ]
};
