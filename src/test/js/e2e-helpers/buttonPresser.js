export function doMash(browser, waitSelector, selector, done) {
  browser.waitForElementPresent(waitSelector || selector, 6000, true)
    .elements('css selector', selector, (result) => {
      browser.elementIdClick(result.value[Math.floor(Math.random() * result.value.length)].ELEMENT);
      done();
    });
}
