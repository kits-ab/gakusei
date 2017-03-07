export function doMash(browser, selector) {
  return new Promise((resolve) => {
    browser.waitForElementPresent(selector, 6000, true)
    .elements('css selector', selector, (result) => {
      browser.elementIdClick(result.value[Math.floor(Math.random() * result.value.length)].ELEMENT);
      resolve();
    });
  });
}

export async function mashRandomButtons(browser, selector, stopSelector, done) {
  let shouldStop = false;

  do {
    // Normally you want all promises created immediately, but this is test automation.
    // eslint-disable-next-line no-await-in-loop
    await doMash(browser, selector);

    // eslint-disable-next-line no-await-in-loop
    await setTimeout(() => browser.elements('css selector', stopSelector, (result) => {
      console.log('found:');
      console.log(result.value);
      shouldStop = result.value.length > 0;
    }), 500);
  } while (!shouldStop);

  done();
}

