/* eslint-disable no-console */

const path = require('path');
const checker = require('license-checker');
const fs = require('fs');

const timerMessage = 'package.json dependencies written to frontend_licenses.json';
const timerMessageDev = 'dummy package.json dependencies written to frontend_licenses.json';

if (process.env.NODE_ENV === 'production') {
  console.time(timerMessage);
  checker.init({
    start: '.',
    json: path.resolve('../frontend_licenses.json')
  }, (err, json) => {
    if (err) {
      throw err;
    } else {
      const newJson = {};
      Object.keys(json).forEach((key) => {
        const value = json[key];
        delete value.licenseFile;
        newJson[key] = value;
      });

    //   console.log(newJson);
      fs.writeFile(path.resolve('./src/main/resources/static/license/frontend_licenses.json'), JSON.stringify(newJson), (err2) => {
        if (err2) {
          throw err2;
        }
      });
      console.timeEnd(timerMessage);
      return newJson;
    }
  });
} else {
  console.time(timerMessageDev);
  const dummyPackage = { 'dummypackage@0.0.1': {
    licenses: 'MIT',
    repository: 'http://github.com/dummypackage'
  } };

  fs.writeFile(path.resolve('./src/main/resources/static/license/frontend_licenses.json'), JSON.stringify(dummyPackage), (err2) => {
    if (err2) {
      throw err2;
    }
  });

  console.timeEnd(timerMessageDev);
}
