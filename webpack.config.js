/* global env */
const path = require('path');
// const merge = require('webpack-merge');
// const base = require('./config/base.js');
// const production = require('./config/production.js');
// const development = require('./config/development.js');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    'js/main_bundle.js': [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:7777',
      './src/main/js/main.js'
    ] },
  output: {
    path: 'target/classes/static',
    filename: '[name]',
    sourceMapFilename: '[name].map',
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
  },
  // Source mapping, to be able to get readable code in the chrome devtools
  devtool: 'source-map',
  // devServer: For running a local web server on localhost:7777
  // it will proxy back to localhost:8080 for api requests
  devServer: {
    hot: true,
    port: 7777,
    host: 'localhost',
    noInfo: false,
    stats: 'normal',
    historyApiFallback: true,
    proxy: {
      '/css/**': 'http://localhost:8080',
      '/img/**': 'http://localhost:8080',
      '/auth': 'http://localhost:8080',
      '/username': 'http://localhost:8080',
      '/registeruser': 'http://localhost:8080',
      '/api/*': {
        target: 'http://localhost:8080/',
        secure: false
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    // HotModuleReplacementPlugin: Partial page reloads instead of full page refresh
    new webpack.HotModuleReplacementPlugin(),

    // NamedModulesPlugin: prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin(),

    // HtmlWebpackPlugin: Generate a html file into memory. Should be identical to the templates/index.html file
    new HtmlWebpackPlugin({
      template: path.resolve('src/main/resources/templates/webpack_index.html')
    }),

    // WebpackShellPlugin: Help us run some checks!
    new WebpackShellPlugin({
      onBuildStart: ['node scripts/checkWatcherCount.js']
    })
  ]
};
