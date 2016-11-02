(function () {

      'use strict';

      angular.module('starter').controller('pengirimanCtrl', ['$rootScope', '$scope', pengirimanCtrl]);

      function pengirimanCtrl($rootScope, $scope){
          var vm = this;

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
		      $rootScope.dataBusiness.logo = "img/ionic.png";
		    }
		    // DATA ROLE
		    $rootScope.dataRole = JSON.parse(localStorage.getItem("userInfo")).role;
		  });
		  
      };

})();