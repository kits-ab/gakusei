const path = require('path');
const webpack = require('webpack');
// const ForkCheckerPlugin = require('ForkCheckerPlugin');
// const HtmlWebpackPlugin = require('HtmlWebpackPlugin');

module.exports = {
  entry: [
    './src/main/js/main.js'
  ],
  context: path.resolve('./'),
  output: {
    path: path.join('target/classes/static/js/'),
    filename: 'main_bundle.js',
    publicPath: '/static/',
      // necessary for HMR to know where to load the hot update chunks
    sourceMapFilename: '[name].map'
      // hotUpdateChunkFilename: '/hot/[hash].hot-update.js',
      // hotUpdateMainFilename: '/hot/[hash].hot-update.json'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [path.join(__dirname, 'src'), 'node_modules']
  },
  rules: [
        { test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ }
        // {
        //   test: /\.ts$/,
        //   use: [
        //     'awesome-typescript-loader',
        //     'angular2-template-loader'
        //   ],
        //   exclude: [/\.(spec|e2e)\.ts$/]
        // },
        // {
        //   test: /\.css$/,
        //   use: ['to-string-loader', 'css-loader']
        // },
        // {
        //   test: /\.(jpg|png|gif)$/,
        //   use: 'file-loader'
        // },
        // {
        //   test: /\.(woff|woff2|eot|ttf|svg)$/,
        //   use: {
        //     loader: 'url-loader',
        //     options: {
        //       limit: 100000
        //     }
        //   }
        // }
  ],
  plugins: [
    //   new ForkCheckerPlugin(),

    //   new webpack.optimize.CommonsChunkPlugin({
    //     name: ['polyfills', 'vendor'].reverse()
    //   })
    //   new HtmlWebpackPlugin({
    //     template: 'src/index.html',
    //     chunksSortMode: 'dependency'
    //   })
  ]
};
