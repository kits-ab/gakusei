/* global env */
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const prodConfig = require('./webpack.partial.prod.js');
const devConfig = require('./webpack.partial.dev.js');
const packageJson = require('./package.json');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = function (env) {
  let partialConfig;
  const shellScripts = ['node scripts/updateVersionFromMavenPom.js'];

  if (process.env.NODE_ENV === 'production') {
    console.log('this is production');
    partialConfig = prodConfig;
  } else {
    partialConfig = devConfig;
    console.log('this is development');
    // Since we are in development environment
    // Make sure that we have enough file watchers on current OS
    shellScripts.push('node scripts/checkWatcherCount.js');
  }

  const theConfig = merge(partialConfig, {
    entry: [
      './src/main/js/main.js'
    ],
    output: {
      // 'path' variable should be *target* if development
      // and *resources* if production (to incorporate into .jar file)
      filename: 'main_bundle.js',
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          enforce: 'pre',
          exclude: /(node_modules|bower_components|\.spec\.js)/,
          use: [
            {
              loader: 'eslint-loader',
              options: {
                failOnWarning: false,
                failOnError: false,
                quiet: true
              }
            }
          ]
        },
        {
          test: /\.jsx?$/,
          use: ['babel-loader'],
          exclude: /(node_modules|bower_components|\.spec\.js)/
        },
        {
          test: /\.json$/,
          use: ['json-loader'],
          exclude: /(node_modules|bower_components|\.spec\.js)/
        },
        {
          test: /\.xml$/,
          use: ['xml-loader'],
          exclude: /(node_modules|bower_components|\.spec\.js)/
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PROJECT_VERSION: JSON.stringify(packageJson.version),
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
        }
      }),
      new WebpackShellPlugin({
        onBuildStart: shellScripts
      })
    ]
  });

  // console.log(theConfig);
  return theConfig;
};
