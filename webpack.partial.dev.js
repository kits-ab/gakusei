const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  output: {
    publicPath: '/',
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'target/classes/static/')
  },
  entry: {
    main: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:7777'
    ] },
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
      filename: 'index.html',
      template: path.resolve('src/main/resources/static/html/webpack_index.html')
    })
  ]
};
