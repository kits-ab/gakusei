/* eslint-disable no-console */

module.exports = {
  // can be string or function
  url() {
    return this.api.launchUrl;
  },

  elements: {
    // shorthand, specifies selector
    glosorDropdown: 'li.glosorDropdown',
    flashcardsPlayListItem: 'li.flashcardPlay',
    guessPlayListItem: 'li.guessPlay',
    translatePlayListItem: 'li.translatePlay',
    quizPlayListItem: 'li.quizPlay',
    firstListGroupItem: 'button.list-group-item:first-of-type',
    submitButton: 'button[type="submit"]'
  },

  commands: [
    {
      gotoSelectScreen(playType = 'guess') {
        const menuSelector = this.elements[`${playType}PlayListItem`].selector;

        this.click('@glosorDropdown')
        .waitForElementVisible(menuSelector)
        .click(menuSelector);
        return this;
      }
    }
  ]
};
