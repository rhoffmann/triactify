module.exports = {
  entry: "./src/js/app.js",
  output: {
    filename: "./src/js/bundle.js"
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
