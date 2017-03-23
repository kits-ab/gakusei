/* global env */
const merge = require('webpack-merge');
const webpack = require('webpack');
const prodConfig = require('./webpack.partial.prod.js');
const devConfig = require('./webpack.partial.dev.js');
const packageJson = require('./package.json');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = function () {
  let partialConfig;
  const shellScripts = ['node scripts/updateVersionFromMavenPom.js'];

  if (process.env.NODE_ENV === 'production') {
    partialConfig = prodConfig;
    console.info('');
    console.info('Production mode: Please make sure to recompile via maven/spring-boot after this!');
    console.info('');
  } else {
    partialConfig = devConfig;
    // Since we are in development environment
    // Make sure that we have enough file watchers on current OS
    shellScripts.push('node scripts/checkWatcherCount.js');
  }

  const theConfig = merge(partialConfig, {
    entry: {
      main: [
        './src/main/js/main.js'
      ] },
    output: {
      // 'path' variable should be *target* if development
      // and *resources* if production (to incorporate into .jar file)
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
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks(module) {
          return module.context && module.context.indexOf('node_modules') !== -1;
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest' // But since there are no more common modules between them we end up with just the runtime code included in the manifest file
      })
    ]
  });

  // console.log(theConfig);
  return theConfig;
};
