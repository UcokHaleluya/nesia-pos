(function () {

      'use strict'; 

      angular.module('starter').controller('riwayatGudangCtrl', ['$rootScope', '$scope', '$http', '$ionicLoading', '$stateParams', riwayatGudangCtrl]);

      function riwayatGudangCtrl($rootScope, $scope, $http, $ionicLoading, $stateParams){
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
		      $rootScope.dataBusiness.logo = "img/logobisnis.png";
		    }
		    // DATA ROLE
		    $rootScope.dataRole = JSON.parse(localStorage.getItem("userInfo")).role;
		  });
		  		 
		  $scope.tgl = {
		  	from_date : new Date(),
		  	to_date : new Date()
		  };
		  $scope.getInput = {};
		  var helper = localStorage.getItem("listWarehouses");
		  $scope.gudang = JSON.parse(helper);		  
		  
		  $scope.request = function(){
		  $scope.transferHistory = {};
		  	var parameter = Object.assign($scope.getInput, $scope.tgl);		  	
		  	$ionicLoading.show({});
		  	$rootScope.http('warehouse-transfer-history', { 
		  		from_warehouse : parameter.from_warehouse,
		  		to_warehouse : parameter.to_warehouse,
		  		to_date : parameter.to_date,
		  		from_date : parameter.to_date
                },
                function(response) {
                    if (response.success) {
                        $scope.transferHistory = response;
                        if ($scope.transferHistory.data == null || $scope.transferHistory.data.length < 1) {
                        	$rootScope.toast("Tidak ada riwayat transfer");
                        	$ionicLoading.hide();
                        } else {
                        	$ionicLoading.hide();
                        };                        
                    } else {
                        // Popup pesan respon
                        $rootScope.ionicAlert($ionicPopup, response.message);
                        $ionicLoading.hide();
                    }
                },
                function() { // error
                    $rootScope.toast("Gagal terhubung ke server");
                    $ionicLoading.hide();
                },
                function() { // complete
                    $ionicLoading.hide();
                }
            );
		  };

		  $scope.getAll = function(){
		  	$ionicLoading.show({});
		  	$rootScope.http('warehouse-transfer-history', null,
                function(response) {
                    if (response.success) {
                        $scope.transferHistory = response;
                        if ($scope.transferHistory.data == null || $scope.transferHistory.data.length < 1) {
                        	$rootScope.toast("Tidak ada riwayat transfer");
                        	$ionicLoading.hide();
                        } else {
                        	$ionicLoading.hide();
                        };
                    } else {
                        // Popup pesan respon
                        $rootScope.ionicAlert($ionicPopup, response.message);
                    }
                },
                function() { // error
                    $rootScope.toast("Gagal terhubung ke server");
                    $ionicLoading.hide();
                },
                function() { // complete
                    $ionicLoading.hide();
                });
		  };

		  $scope.showName = function(e){
		  	if (e == null) {
		  		return "Nama tidak ada.";
		  	} else {
		  		var tmp = localStorage.getItem("listWarehouses");
		  		tmp = JSON.parse(tmp);
		  		var checked = false;
		  		for(var attr in tmp){
		  			if (tmp[attr].id == e) {		  				
		  				return tmp[attr].name;
		  				checked = true;
		  			};
		  		};
		  		if (checked == false) {
		  			return "Gudang tidak terdaftar.";
		  		};
		  	};

		  };

		  $scope.showDate = function(e){
		  	if (e == null) {
		  		return "-";
		  	} else {
		  		var dates = new Date(e);
		  		var day = dates.getDate();
		  		var mounth = dates.getMonth();
		  		var year = dates.getFullYear();
		  		var fulldate = day + "/" + mounth + "/" + year;
		  		return fulldate;
		  	};
		  };

		  $scope.showItems = function(e){
		  	if (e == null || e.length < 1) {
		  		return 0;
		  	} else {
		  		return e.length + " Jenis";
		  	};
		  };

		  $scope.showRemarks = function(e){
		  	if (e == null || e == "") {
		  		return "-";
		  	} else {
		  		return e;
		  	};
		  };		  		  	
      };

})();