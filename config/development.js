// const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./base.js');

console.log('base:');
console.log(base);

module.exports = {
  module: {
    entry: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:7777',
      'webpack/hot/only-dev-server'
    ],
    output: {
      publicPath: '/static/'
    },
    devtool: 'source-map',
    // output: {
    //   path: path.join(__dirname, '/../dist/assets'),
    //   filename: '[name].bundle.js',
    //   // publicPath,
    //   sourceMapFilename: '[name].map'
    // },
    devServer: {
      hot: true,
      port: 7777,
      host: 'localhost',
      noInfo: false,
      stats: 'minimal',
      // contentBase: path.join('/target/classes/static/'),
      // publicPath
      proxy: {
        // '**': {
        //   target: 'http://localhost:8080',
        //   secure: false,
        //   bypass(req, res, proxyOptions) {
        //     // console.log(req);
        //     // console.log(res);
        //     console.log(proxyOptions);
        //     console.log('hi');
        //     // if (req.headers.accept.indexOf('html') !== -1) {
        //     //   console.log('Skipping proxy for browser request.');
        //     //   return '/index.html';
        //     // }
        //   }
        // },
      '/': 'http://localhost:8080',
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
      new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

      new webpack.NamedModulesPlugin()
    // prints more readable module names in the browser console on HMR updates
    ]
  }
};
