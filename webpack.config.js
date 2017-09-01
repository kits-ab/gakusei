/* eslint-disable no-console */

const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const prodConfig = require('./webpack.partial.prod.js');
const devConfig = require('./webpack.partial.dev.js');
const packageJson = require('./package.json');
const WebpackShellPlugin = require('webpack-shell-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = function () {
  let partialConfig;
  const shellScripts = [
    'node scripts/updateVersionFromMavenPom.js',
    'node scripts/generateFrontendLicenses.js'
  ];

  if (process.env.NODE_ENV === 'production') {
    partialConfig = prodConfig;
    console.info('');
    console.info('Production mode: Please make sure to recompile via maven/spring-boot after this!');
    console.info('');
  } else {
    partialConfig = devConfig;
    // Don't show any recompile warnings if we run via the dev server
    if (process.env && process.env.npm_lifecycle_script !== 'webpack-dev-server') {
      console.info('');
      console.info('Development mode: Please make sure to recompile via maven/spring-boot after this!');
      console.info('');
    }
    // Make sure that we have enough file watchers on current OS
    shellScripts.push('node scripts/checkWatcherCount.js');
  }

  const theConfig = merge.smart(partialConfig, {
    entry: {
      main: [
        'react-hot-loader/patch', 
        './src/main/js/main.js'
      ] },
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
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
          exclude: /(node_modules|bower_components|\.spec\.js)/
        }
        // {
        //   test: /\.xml$/,
        //   use: ['xml-loader'],
        //   exclude: /(node_modules|bower_components|\.spec\.js)/
        // }
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

  if (process.env && process.env.npm_lifecycle_script !== 'webpack-dev-server') {
    // Add cleaner
    theConfig.plugins.push(new CleanWebpackPlugin(['src/main/resources/static/js/*'], {
      root: path.resolve(),
      verbose: true
    }));
  }

  console.log(theConfig.module.rules[0]);
  return theConfig;
};
