(function () {
  'use strict';

  angular
    .module('indexModule', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {

    $stateProvider
      .state('index', {
        url: '/',
        views: {
          'main': {
            templateUrl: 'views/index/default.html',
            controller: 'IndexCtrl',
            controllerAs: 'index'
          }
        }
      });

  }

})();
