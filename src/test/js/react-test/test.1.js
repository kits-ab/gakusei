const webdriverio = require('webdriverio');

const options = {
  desiredCapabilities: {
    browserName: 'chrome'
  }
};

console.log('Let\'s do testing');

webdriverio
 .remote(options)
 .init()
 .url('http://www.google.com')
 .title((err, res) => {
   console.log(`Title was: ${res.value}`);
 })
 .end();
