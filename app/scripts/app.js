(function () {
  'use strict';

  angular
    .module('angular', [
      'ngAnimate',
      'ngCookies',
      'ngResource',
      'ui.router',
      'ngSanitize',
      'ngTouch',
      'common',
      'indexModule'
    ])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $urlRouterProvider) {

    // Convert upper-case urls to lower-case
    $urlRouterProvider.rule(function ($injector, $location) {
      var path = $location.path(),
        lowerCasePath = path.toLowerCase();
      if (path !== lowerCasePath) {
        $location.replace().path(lowerCasePath);
      }
    });

    // Set HTML 5 urls mode
    //$locationProvider.html5Mode(true).hashPrefix("!");

    // Default location
    $urlRouterProvider.otherwise("/");

  }

})();
