(function () {
  'use strict';

  angular
    .module('indexModule')
    .controller('IndexCtrl', IndexCtrl);

  /** @ngInject */
  function IndexCtrl() {
    var vm = this;
    console.log("IndexCtrl ready");
  }

})();

