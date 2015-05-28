'use strict';

var tests = Object.keys(window.__karma__.files).filter(function (file) {
    return (/(.spec)\.js$/i).test(file);
});

require.config({
    baseUrl: '/base/site/assets/js',
    paths: {
        angular: '../vendor/angular/angular',
        angularMocks: '../vendor/angular-mocks/angular-mocks',
        jasmineMatchers: '../vendor/jasmine-expect/dist/jasmine-matchers',
        jquery: '../vendor/jquery/dist/jquery',
        underscore: '../vendor/underscore/underscore',
        views: '../views'
    },
    shim: {
        angular: {
            exports: 'angular',
            deps: [ 'jquery' ]
        },
        angularMocks: [ 'angular' ],

        // views
        // 'views/default.tpl.html': [ 'angularMocks' ]
    },
    deps: tests,
    callback: window.__karma__.start
});