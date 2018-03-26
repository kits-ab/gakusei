/* eslint-env node */

var path = require('path');
var options = {
  context: path.resolve(__dirname, '../src')
};

// This file is for unit tests to work properly
require('ignore-styles');
// ES6/ES201X-functionality
require('babel-polyfill');
require('babel-register')({
  // This is a .babelrc config
  sourceMaps: 'inline',
  retainLines: true,
  presets: [
    [
      'env',
      {
        targets: {
          browsers: ['last 2 versions', 'safari >= 7']
        },
        // modules: true, // because webpack won't handle this for us
        useBuiltIns: true
      }
    ],
    'react'
  ],
  plugins: [
    'transform-object-rest-spread'
    // 'rewire',
    // [
    //   'react-css-modules',
    //   {
    //     context: options.context,
    //     // include: "\.module\.(less|css)$", // PR pending
    //     exclude: '^(?!.*module).+.(less|css)$',
    //     filetypes: {
    //       '.less': {
    //         syntax: 'postcss-less'
    //       }
    //     },
    //     generateScopedName: '[local]'
    //   }
    // ]
    // ['module-alias', [{ src: './src/app/spine', expose: 'spine' }]] /* unit testing */
  ]
}); // to be able to write es6+ tests

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

var Adapter = require('enzyme-adapter-react-16');
var configure = require('enzyme').configure;
configure({ adapter: new Adapter() });

// MISC
// ------
// To avoid chai `should` property leaking into JSON stringify when the object itself is a proxy object
global.stringifyOriginal = JSON.stringify;
global.window.stringifyOriginal = JSON.stringify;
JSON.stringify = (x, originalReplacer) =>
  global.stringifyOriginal(x, (key, value) => {
    let modifiedValue = value;
    if (key === 'should') {
      modifiedValue = undefined;
    }

    if (originalReplacer) {
      return originalReplacer(key, modifiedValue);
    }
    return modifiedValue;
  });
