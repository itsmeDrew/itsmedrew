'use strict';

require.config({
  paths: {
    almond: '../vendor/almond/almond',
    angular: '../vendor/angular/angular',
    classie: '../vendor/classie/classie',
    jquery: '../vendor/jquery/dist/jquery',
    ngAnimate: '../vendor/angular-animate/angular-animate',
    stapes: '../vendor/stapes/stapes',
    underscore: '../vendor/underscore/underscore'
  },
  shim: {
    angular: {
      exports: 'angular',
      deps: [ 'jquery' ]
    },
    ngAnimate: [ 'angular' ]
  },
  deps: [
    'angular',
    'app'
  ],
  callback: function(angular) {
    angular.bootstrap(document, [ 'App' ]);
  }
});
