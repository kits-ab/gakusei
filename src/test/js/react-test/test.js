const webdriver = require('selenium-webdriver');

const driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

// ask the browser to open a page
driver.navigate().to('http://localhost:8080/');
