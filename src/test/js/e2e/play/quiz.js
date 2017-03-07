import { mashRandomButtons } from '../../e2e-helpers/buttonPresser';
import { logoutUser, authUser } from '../../e2e-helpers/auth';

module.exports = {
  before(browser) {
    authUser(browser, 'test_account', 'test_password', (err) => {
      if (err) {
        throw err;
      } else {
        // All good!
      }
    });
  },
  after(browser) {
    logoutUser(browser, (err) => {
      if (err) {
        throw err;
      } else {
        // All good!
      }
    });
    browser.end();
  },
  'Start a quiz game': function (browser) {
    browser.init()
    .click('li.quizPlay')
    .waitForElementVisible('button.list-group-item', 2500, true, () => {
      mashRandomButtons(browser, 'button.list-group-item', 'div', () => {
        // Selected a random lesson, let's go
        browser.click('button[type="submit"]');
        mashRandomButtons(browser, 'button.answerbutton:not([disabled])', 'div', (err) => {
            // Done mashing
          if (err) {
            throw err;
          } else {
              // All good!
          }
        });
      });
    })
    .pause(10000);
    // .elements('css selector', 'button.list-group-item', (result) => {
    //   const count = result.value.length;
    //   browser.click(`button.list-group-item:nth-of-type(${Math.floor(Math.random() * count) + 1})`)
    //   .click('button[type="submit"]')
    //   .pause(5000);
    // });
  }
};
