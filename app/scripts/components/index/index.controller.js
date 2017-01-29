(function() {
  'use strict';

  angular.module('indexModule').controller('IndexCtrl', IndexCtrl);

  /* @ngInject */
  function IndexCtrl() {
    console.log("IndexCtrl ready");
  }

})();
