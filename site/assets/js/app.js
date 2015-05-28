'use strict';

define(
  [
    'angular',
    'ngAnimate',
    'templates'
  ],
  function(angular) {
    return angular
      .module('App', [
        'ngAnimate',
        'mfApp.Templates'
      ])
      .config(configFn);

    function configFn($locationProvider) {
      $locationProvider.html5Mode(true);
    }
  }
);
