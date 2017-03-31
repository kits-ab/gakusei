/* eslint-disable no-console */

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

export function playFlashCardGame(browser) {
  const home = browser.page.home();
  const select = browser.page.select();
  const flashcards = browser.page.flashcards();
  const guess = browser.page.guess();
  const translate = browser.page.translate();

  home.navigate();

  // flashcards
  home.gotoSelectScreen('flashcards');
  select.clickFirstLesson()
  .start();
  flashcards.playUntilFinish();

  // guess
  home.gotoSelectScreen('guess');
  select.clickFirstLesson()
  .start();
  guess.playUntilFinish();

  // translate
  home.gotoSelectScreen('translate');
  select.clickFirstLesson()
  .start();
  translate.playUntilFinish();
}

