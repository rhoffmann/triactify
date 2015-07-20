var webpack = require('webpack');

module.exports = {
  entry: "./src/js/app.js",
  output: {
    path: './dist/js',
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      }
    ]
  }
};

// var _ = require('lodash');
// var webpack = require('webpack');
//
// module.exports = {
//   base: function(config) {
//     return {
//       entry: "./src/app.js",
//       output: {
//         path: './dist',
//         filename: "bundle.js"
//       },
//       module: {
//         loaders: [
//           {
//             test: /\.jsx?$/,
//             exclude: /(node_modules|bower_components)/,
//             loader: 'babel'
//           }
//         ]
//       },
//       plugins:[]
//     };
//   },
//   test: function(config) {
//     return {
//       entry: 'webpack.tests.js',
//       output: _.assign({}, config.output, {
//         path: path.join(config.output.path, 'test'),
//         publicPath: undefined
//       }),
//       devtool: 'inline-source-map',
//       plugins: config.plugins.concat(
//         new webpack.DefinePlugin({
//           'typeof window': JSON.stringify('object')
//         })
//       )
//     };
//   }
//
// };
