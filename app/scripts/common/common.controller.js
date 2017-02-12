(function () {
  'use strict';

  angular
    .module('common')
    .controller('CommonCtrl', CommonCtrl);

  /** @ngInject */
  function CommonCtrl() {
    var vm = this;
    console.log("CommonCtrl ready");
  }

})();
