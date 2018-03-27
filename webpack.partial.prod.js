/* eslint-disable no-console */
/* eslint-env node */

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  output: {
    publicPath: '/js',
    filename: '[name].[chunkhash].bundle.js',
    path: path.resolve(__dirname, 'src/main/resources/static/js')
  },
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: ['webpack-strip-block?start=devcode:start&end=devcode:end']
      }
    ]
  },

  // Source mapping, to be able to get readable code in the chrome devtools
  devtool: 'source-map',
  plugins: [
    //new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
      filename: '../../templates/index.html',
      template: path.resolve('src/main/resources/static/html/webpack_index.html')
    })
  ]
};
