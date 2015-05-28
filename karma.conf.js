'use strict';

module.exports = function (config) {
  config.set({
    basePath: './',
    frameworks: [ 'jasmine', 'requirejs' ],
    files: [
      { pattern: 'site/assets/vendor/**/*.js', included: false },
      { pattern: 'site/assets/js/**/*.js', included: false },
      { pattern: 'site/assets/views/**/*.tpl.html', included: false },
      { pattern: 'tests/unit/**/*.js', included: false },
      'tests/karma-main.js'
    ],
    exclude: [],
    preprocessors: {
      'site/assets/views/**/*.tpl.html': [ 'ng-html2js' ]
    },
    reporters: [ 'dots' ],
    logLevel: config.LOG_ERROR,
    port: 9876,
    colors: true,
    autoWatch: true,
    browsers: [ 'Chrome' ],
    singleRun: false,
    ngHtml2JsPreprocessor: {
      stripPrefix: 'site',
      moduleName: 'templates'
    }
  });
};
