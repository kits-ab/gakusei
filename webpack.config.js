/* global env */
const path = require('path');
// const merge = require('webpack-merge');
// const base = require('./config/base.js');
// const production = require('./config/production.js');
// const development = require('./config/development.js');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const webpack = require('webpack');

// Object.keys(process.env).forEach((key) => {
//   console.log(`${key} = ${process.env[key]}`);
// });

// console.log(`This is env: ${env}`);

// if (env === 'development') {
//   module.exports = base;
// } else if (env === 'production') {
//   module.exports = base;
// }

module.exports = {
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:7777',
      'webpack/hot/only-dev-server',
      './src/main/js/main.js'
    ] },
  output: {
    path: 'target/classes/static',
    filename: 'bundle.js',
    publicPath: '/',
      // necessary for HMR to know where to load the hot update chunks
    sourceMapFilename: '[name].map'
      // hotUpdateChunkFilename: '/hot/[hash].hot-update.js',
      // hotUpdateMainFilename: '/hot/[hash].hot-update.json'
  },
  // resolve: {
  //   extensions: ['.ts', '.js', '.json'],
  //   modules: [path.join(__dirname, 'src'), 'node_modules']
  // },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  },
  // watchOptions: {
  //   aggregateTimeout: 300,
  //   poll: 1000
  // },
  devtool: 'source-map',
  devServer: {
    hot: true,
    port: 7777,
    host: 'localhost',
    noInfo: false,
    stats: 'normal',
      // contentBase: path.join('/target/classes/static/'),
      // publicPath
    proxy: {
      // '/': 'http://localhost:8080',
      '/css/**': 'http://localhost:8080',
      '/img/**': 'http://localhost:8080',
      '/auth': 'http://localhost:8080',
      '/username': 'http://localhost:8080',
      '/registeruser': 'http://localhost:8080',
      '/api/*': {
        target: 'http://localhost:8080/',
        secure: false
          // bypass(req, res, proxyOptions) {
          //   if (req.headers.accept.indexOf('html') !== -1) {
          //     console.log('Skipping proxy for browser request.');
          //     return '/index.html';
          //   }
          // }
      }
    },
    historyApiFallback: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates
    new HtmlWebpackPlugin({
      template: path.resolve('src/main/resources/templates/webpack_index.html')
    }),
    new WebpackShellPlugin({
      onBuildEnd: ['node scripts/checkWatcherCount.js']
    })
  ]
};
