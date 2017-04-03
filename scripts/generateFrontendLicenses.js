/* eslint-disable no-console */

const path = require('path');
const checker = require('license-checker');
const fs = require('fs');

const timerMessage = 'package.json dependencies written to frontend_licenses.json';
const timerMessageDev = 'dummy package.json dependencies written to frontend_licenses.json';

const licenseDirectory = path.resolve('./src/main/resources/static/license/');
const licenseFilePath = path.resolve(licenseDirectory, 'frontend_licenses.json');

if (process.env.NODE_ENV === 'production') {
  console.time(timerMessage);
  checker.init({
    start: '.',
    json: true
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
      try {
        fs.mkdirSync(licenseDirectory);
      } catch (writeErr) { /* File likely already exists */ }
      fs.writeFile(licenseFilePath, JSON.stringify(newJson), (writeErr) => {
        if (writeErr) {
          throw writeErr;
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

  try {
    fs.mkdirSync(licenseDirectory);
  } catch (writeErr) { /* File likely already exists */ }
  fs.writeFile(licenseFilePath, JSON.stringify(dummyPackage), (writeErr) => {
    if (writeErr) {
      throw writeErr;
    }
  });

  console.timeEnd(timerMessageDev);
}
