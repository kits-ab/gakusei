// in e2e/tests/autocomplete.js
const webdriver = require('selenium-webdriver');

const driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

const homePage = require('../pages/home')(driver);

before(() => homePage.navigate());

it('autocompletes the name field', function* () {
  homePage.enterName('John');
  expect(yield homePage.getName()).to.equal('John Doe');
});
