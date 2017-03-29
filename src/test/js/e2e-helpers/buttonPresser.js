/* eslint-disable no-console */

export function doMash(browser, waitSelector, selector, done) {
  browser.waitForElementPresent(waitSelector || selector, 6000, true)
    .elements('css selector', selector, (result) => {
      browser.pause(1, () => console.time('mash a button'))
      .elementIdClick(result.value[Math.floor(Math.random() * result.value.length)].ELEMENT)
      .pause(1, () => console.timeEnd('mash a button'));
      done();
    });
}
