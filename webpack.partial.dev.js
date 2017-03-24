/* eslint-disable no-console */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const indexFilename = function () {
    // if this env variable stops working, try npm_package_scripts_start instead.
  if (process.env && process.env.npm_lifecycle_script !== 'webpack-dev-server') {
    return '../../templates/index.html';
  }
  return 'index.html';
};

const getEntries = function () {
    // if this env variable stops working, try npm_package_scripts_start instead.
  if (process.env && process.env.npm_lifecycle_script !== 'webpack-dev-server') {
    return {};
  }
  return { main: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:7777'
  ] };
};

const getPath = function () {
  if (process.env && process.env.npm_lifecycle_script !== 'webpack-dev-server') {
    return path.resolve(__dirname, 'src/main/resources/static/js');
  }
  return path.resolve(__dirname, 'src/main/resources/static');
};

const getPublicPath = function () {
  if (process.env && process.env.npm_lifecycle_script !== 'webpack-dev-server') {
    return '/js';
  }
  return '/';
};

module.exports = {
  output: {
    publicPath: getPublicPath(),
    filename: '[name].bundle.js',
    path: getPath()
    // If anything breaks, it's because this "/js" part needs to be removed for dev server, I think.
  },
  entry: getEntries,
  // Source mapping, to be able to get readable code in the chrome devtools
  devtool: 'source-map',
  // devServer: For running a local web server on localhost:7777
  // it will proxy back to localhost:8080 for api requests
  devServer: {
    hot: true,
    port: 7777,
    host: 'localhost',
    stats: 'normal',
    historyApiFallback: true,
    proxy: {
      '/icons/**': 'http://localhost:8080',
      '/css/**': 'http://localhost:8080',
      '/img/**': 'http://localhost:8080',
      '/auth': 'http://localhost:8080',
      '/logout': 'http://localhost:8080',
      '/username': 'http://localhost:8080',
      '/registeruser': 'http://localhost:8080',
      '/api/*': {
        target: 'http://localhost:8080/',
        secure: false
      }
    }
  },
  plugins: [
    // HotModuleReplacementPlugin: Partial page reloads instead of full page refresh
    new webpack.HotModuleReplacementPlugin(),

    // NamedModulesPlugin: prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin(),

    // HtmlWebpackPlugin: Generate a html file into memory. Should be identical to the templates/index.html file
    new HtmlWebpackPlugin({
      filename: indexFilename(),
      template: path.resolve('src/main/resources/static/html/webpack_index.html')
    })
  ]
};
