var webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
  config.set({
    browsers: process.env.CONTINUOUS_INTEGRATION ? ['Firefox'] : ['PhantomJS', 'Chrome'],
    frameworks: ['jasmine'],
    basePath: 'src',
    autoWatch: false,
    files: ['tests.webpack.js'],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap']
    },
    // webpack: webpackConfig(['test']),
    webpack: {
      devtool: 'inline-source-map',
      // watch: true,
      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel'
          }
        ]
      }
    },
    client: {
      captureConsole: true
    },
    reporters: ['dots'],
    singleRun: true,
    webpackMiddleware: {
      noInfo: true
    },
    // Webpack takes a little while to compile -- this manifests as a really
    // long load time while webpack blocks on serving the request.
    browserNoActivityTimeout: 60000 // 60 seconds
  });
}
