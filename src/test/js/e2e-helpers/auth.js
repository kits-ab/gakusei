/* eslint-disable no-console */

export function registerUser(browser, username, password, done) {
  browser
    .url(`${browser.launchUrl}/login`)
    .waitForElementVisible('button[name="register"]', 2500, true, () => {
      // Consider page loaded
      browser.setValue('input[name="username"]', username)
        .setValue('input[name="password"]', password)
        .click('button[name="register"]')
        .waitForElementVisible('[name="authFeedback"]', 2500, true)
        .getText('[name="authFeedback"]', (element) => {
          if (element.value === 'Användarnamnet finns tyvärr redan, prova ett annat.') {
            done();
          } else if (element.value === 'Registeringen lyckades, loggar in..') {
            done();
          } else if (element.value === 'Inloggad, tar dig vidare..') {
            // Note: Can happen as this is the text that appears after "Registreringen lyckades, [...]"
            done();
          } else {
            done(new Error('Registration failed for the wrong reasons.'));
          }
        });
    });
}

export function loginUser(browser, username, password, done) {
  browser.url(`${browser.launchUrl}/login`)
    .waitForElementVisible('button[name="login"]', 2500, true, () => {
      browser.setValue('input[name="username"]', username)
        .setValue('input[name="password"]', password)
        .click('button[name="login"]')
        .waitForElementVisible('h2[name="greeter"]', 2500, false)
        .perform(() => {
          done();
        });
    });
}

export function logoutUser(browser, done) {
  browser
    .waitForElementPresent('li.logoutButton', 2500, true, () => {
      browser.click('li.logoutButton')
      .waitForElementVisible('input[name="username"]', 2500, true, () => {
        browser.getValue('input[name="username"]', (element) => {
          if (element.value === '') {
            done();
          } else {
            done(new Error('Login form not empty'));
          }
        });
      });
    });
}

export function authUser(browser, username, password, done) {
  registerUser(browser, username, password, (registerError) => {
    if (registerError) {
      done(registerError);
    } else {
      done();
    }
    loginUser(browser, username, password, (loginError) => {
      if (loginError) {
        done(loginError);
      } else {
        done();
      }
    });
  });
}
