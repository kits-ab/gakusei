/* eslint-env node */

// This file is for unit tests to work properly
// require('ignore-styles');
// ES6/ES201X-functionality
// require('babel-polyfill');
require('babel-register')({
  // This will override `node_modules` ignoring - you can alternatively pass
  // an array of strings to be explicitly matched or a regex / glob
  ignore: function(filename) {
    if (filename.includes('moresketchy')) {
      return false;
    } else if (filename.includes('node_modules')) {
      return true;
    } else {
      return false;
    }
  },
  // This is a .babelrc config
  sourceMaps: 'inline',
  retainLines: true,
  presets: [
    [
      'env',
      {
        targets: {
          node: '8.1.2'
        }
      }
    ],
    'react'
  ],
  plugins: ['transform-object-rest-spread']
});

// Chai
require('chai/register-assert'); // Using Assert style
require('chai/register-expect'); // Using Expect style
require('chai/register-should'); // Using Should style

// DOM simulation things
// ------------------------
if (!global.dom) {
  const jsdom = require('jsdom');
  // Define some html to be our basic document
  // JSDOM will consume this and act as if we were in a browser
  const DEFAULT_HTML = '<html><body></body></html>';
  // Define some variables to make it look like we're a browser
  // First, use JSDOM's fake DOM as the document
  const dom = new jsdom.JSDOM(DEFAULT_HTML);
  // Set up a mock window
  global.window = dom.window;
  global.document = dom.window.document;
  // Allow for things like window.location
  global.navigator = global.window.navigator;

  global.dom = dom;

  // ugly shim for react 16 to stop complaining
  if (!global.requestAnimationFrame) {
    global.requestAnimationFrame = callback => {
      setTimeout(callback, 0);
    };
  }
}

// Put react on Window, that's what we do in the normal application (for now)
global.React = require('react');
global.ReactDOM = require('react-dom');
global.window.React = global.React;
global.window.ReactDOM = global.ReactDOM;

// Not on React 16 yet
// var Adapter = require('enzyme-adapter-react-16');
// var configure = require('enzyme').configure;
// configure({ adapter: new Adapter() });
