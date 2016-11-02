(function () {

      'use strict';

      angular.module('starter').controller('riwayatTransferCtrl', ['$rootScope', '$scope', '$http', '$ionicLoading', '$stateParams', riwayatTransferCtrl]);

      function riwayatTransferCtrl($rootScope, $scope, $http, $ionicLoading, $stateParams){
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
		  	awal : new Date(),
		  	akhir : new Date()
		  };
		  		 		

		  $scope.firstLoad = function() {
		  	$rootScope.ionicLoading([]);
		  	//alert(JSON.stringify(param));
		  	 if ($scope.tgl.awal == null) {
			  	if ($scope.tgl.akhir == null) {
			  		var param = {
				  		token : localStorage.getItem("token"),
				  		device : localStorage.getItem("deviceUUID"),
				  		warehouse_id : $stateParams.id
				  	 	};
			  	} else {
			  		var param = {
				  		token : localStorage.getItem("token"),
				  		device : localStorage.getItem("deviceUUID"),  			
				  		to_date : $scope.tgl.akhir,
				  		warehouse_id : $stateParams.id
				  		};
			  	};		  	
			  } else {
			  	if ($scope.tgl.akhir == null) {
			  		var param = {
				  		token : localStorage.getItem("token"),
				  		device : localStorage.getItem("deviceUUID"),
				  		from_date : $scope.tgl.awal,
				  		warehouse_id : $stateParams.id 			
				  		};
			  	} else {
			  		var param = {
				  		token : localStorage.getItem("token"),
				  		device : localStorage.getItem("deviceUUID"),
				  		from_date : $scope.tgl.awal,
				  		to_date : $scope.tgl.akhir,
				  		warehouse_id : $stateParams.id
				  		};
			  	};
			  	
			  };

		  	$http({ method : 'POST',
		  			url : config.server + "warehouse-product-history",
		  			data : param,
		  			headers : {
		  				"Content-Type" : "application/x-www-form-urlencoded"
		  			}
		  	}).success(function(serverData){
		  		serverData.data.map(function(d){
		  			d.date = new Date(d.date);
		  		})		  				  	
		  		$scope.prodHistory = serverData;
		  		console.log('dataServer', serverData.data);
		  		$rootScope.ionicLoadingHide();	  		
		  	}).error(function(){
		  		alert("Gagal terhubung ke server");
		  		console.log('dataServer', serverData.data);
		  		$rootScope.ionicLoadingHide();
		  	})
		  };//first load
  		  
  		  $scope.firstLoad();
      };

})();