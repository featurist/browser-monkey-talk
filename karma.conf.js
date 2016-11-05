// Karma configuration
// Generated on Sat Oct 10 2015 11:36:44 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      // mocha test framework
      'mocha',
      // browserify for stitching JS files together using require
      'browserify'
    ],


    // list of files / patterns to load in the browser
    files: [
      // CSS
      'browser/style/style.css',
      // example images
      {pattern: 'test/browser/images/*', included: false, served: true},
      // fonts used in CSS
      {pattern: 'node_modules/font-awesome/fonts/**', included: false, served: true},
      // specifications
      'test/**/*Spec.js'
    ],


    // list of files to exclude
    exclude: [
      // vim swap files
      '**/*.sw?'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // which files to browserify
      'test/**/*.js': [ 'browserify' ]
    },

    browserify: {
      // source maps
      debug: true,
      // JSX support for plastiq
      transform: ['babelify'],
      extensions: ['.jsx']
    },

    proxies: {
      // map requests to the left, to file paths on the right
      '/images/': '/base/test/browser/images/',
      '/base/browser/fonts/': '/base/node_modules/font-awesome/fonts/'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],

    mochaReporter: {
      showDiff: true
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
