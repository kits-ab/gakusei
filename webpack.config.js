/* global env */
const path = require('path');
const merge = require('webpack-merge');
const prodConfig = require('./webpack.partial.prod.js');
const devConfig = require('./webpack.partial.dev.js');

module.exports = function (env) {
  let partialConfigToUse;
  if ((env || 'development') === 'development') {
    partialConfigToUse = devConfig;
  } else if (env === 'production') {
    partialConfigToUse = prodConfig;
  }

  return merge.smart(partialConfigToUse, {
    output: {
      // 'path' variable should be *target* if development
      // and *resources* if production (to incorporate into .jar file)
      filename: 'main_bundle.js',
      publicPath: '/'
    // sometimes necessary for HMR to know where to load the hot update chunks
      // hotUpdateChunkFilename: '/hot/[hash].hot-update.js',
      // hotUpdateMainFilename: '/hot/[hash].hot-update.json'
    },
  // don't need this for now, maybe later
  // resolve: {
  //   extensions: ['.ts', '.js', '.json'],
  //   modules: [path.join(__dirname, 'src'), 'node_modules']
  // },
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
        }
      ]
    }
  });
};

