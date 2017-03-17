const webpack = require('webpack');

module.exports = {
  entry: {
    'js/main_bundle.js': [
      './src/main/js/main.js'
    ] },

  // Source mapping, to be able to get readable code in the chrome devtools
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),

    // Production things!
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
  ]
};
