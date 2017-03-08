import { doMash } from '../../e2e-helpers/buttonPresser';
import { logoutUser, authUser } from '../../e2e-helpers/auth';
import { dumpBrowserLogs } from '../../e2e-helpers/logs';

export function before(browser) {
  authUser(browser, 'test_account', 'test_password', (err) => {
    if (err) {
      throw err;
    } else {
        // All good!
    }
  });
}

export function beforeEach(browser) {
  browser.execute(() => {
      // To faster progress the button presses
    const canUseDOM = !!(
       typeof window !== 'undefined' &&
       window.document &&
       window.document.createElement
     );
    if (canUseDOM) {
      window.customDelay = 1;
    }
  }, [], null);
}

export function after(browser) {
  console.log('All done, logging out!!');
  logoutUser(browser, (err) => {
    if (err) {
      throw err;
    } else {
        // All good!
    }
  });
  console.log('Logged out!');
  browser.end();
}

export function afterEach(client, done) {
  dumpBrowserLogs(client, done);
}

export function playQuizGame(browser) {
  browser
    .click('li.quizPlay');
  doMash(browser, null, 'button.list-group-item', () => {
        // Selected a random lesson, let's go
    browser.click('button[type="submit"]');
    const repeatMash = function (done) {
      doMash(browser, 'button.answerbutton[name="answerbutton-1"]', 'button.answerbutton:not([disabled])', () => {
        browser.waitForElementPresent('button.answerbutton[name="answerbutton-1"]:not([disabled]):first-of-type, .list-group', 5000, true)
          .elements('css selector', '.list-group', (result) => {
            if (result.value.length === 0) {
              repeatMash(null);
            } else if (/* is callback function */ done /* defined?*/) {
              done();
            }
          });
      });
    };
    repeatMash(() => {
        // Finish screen, here we can define assertions etc.
    });
  });
}
export function playGuessGame(browser) {
  browser
    .click('li.glosorDropdown')
    .waitForElementVisible('li.guessPlay', 2500, true)
    .click('li.guessPlay', () => doMash(browser, null, 'button.list-group-item', () => {
        // Selected a random lesson, let's go
      browser.click('button[type="submit"]');
      const repeatMash = function (done) {
        doMash(browser, 'button.answerbutton[name="answerbutton-1"]', 'button.answerbutton:not([disabled])', () => {
          browser.waitForElementPresent('button.answerbutton[name="answerbutton-1"]:not([disabled]):first-of-type, .list-group', 5000, true)
          .elements('css selector', '.list-group', (result) => {
            if (result.value.length === 0) {
              repeatMash(null);
            } else if (/* is callback function */ done /* defined?*/) {
              done();
            }
          });
        });
      };
      repeatMash(() => {
          // Finish screen, here we can define assertions etc.
      });
    })
   );
}
export function playTranslateGame(browser) {
  browser
    .click('li.glosorDropdown')
    .waitForElementVisible('li.translatePlay', 2500, true)
    .click('li.translatePlay', () => doMash(browser, null, 'button.list-group-item', () => {
        // Selected a random lesson, let's go
      browser.click('button[type="submit"]');
      const repeatMash = function (done) {
        browser.setValue('input[name="translateText"]', 'wrong answer', () => {
          browser.click('button[type="submit"]')
            .waitForElementPresent('input[name="translateText"]:not([disabled]):nth-of-type(1), .list-group', 5000, true)
              .elements('css selector', '.list-group', (result) => {
                if (result.value.length === 0) {
                  repeatMash(null);
                } else if (/* is callback function */ done /* defined?*/) {
                  done();
                }
              });
        });
      };
      repeatMash(() => {
          // Finish screen, here we can define assertions etc.
      });
    })
    );
}
