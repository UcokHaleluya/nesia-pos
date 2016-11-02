(function () {

      'use strict';

      angular.module('starter').controller('pembelianCtrl', ['$rootScope', '$scope', pembelianCtrl]);

      /**
	   * @memberof starter
	   * @ngdoc controller
	   * @name pembelianCtrl
	   * @param $rootScope {service} controller root scope
	   * @param $scope {service} controller scope
	   */

      function pembelianCtrl($rootScope, $scope){
      	/**
     	* @property {Hash} vm collection og objects that belongs to this pembelian controller
     	*/	
          var vm = this;

      	/**
	     * Menjalankan parameter ketika ui tampil
	     * @memberof pembelianCtrl
	     * @function $scope.$on
	     * @$ionicView.enter {Service} memasuki ui
	     */
          // User Info Update
		  $scope.$on('$ionicView.enter', function() {
		    // SIMPAN SEMUA DATA USER
		    // DATA USER
		    $rootScope.dataUser = JSON.parse(localStorage.getItem("userInfo")).user;
		    // DATA PROFILE
		    $rootScope.dataProfile = JSON.parse(localStorage.getItem("userInfo")).profile;
		    // DATA BUSINESS
		    $rootScope.dataBusiness = JSON.parse(localStorage.getItem("userInfo")).business;
		    // Jika logo Bisnis kosong
		    if(!$rootScope.dataBusiness.logo) {
		      $rootScope.dataBusiness.logo = "img/logobisnis.png";
		    }
		    // DATA ROLE
		    $rootScope.dataRole = JSON.parse(localStorage.getItem("userInfo")).role;
		  });
		  
      };

})();