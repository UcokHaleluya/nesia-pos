(function () {

      'use strict';

      /**
	   * @memberof starter
	   * @ngdoc controller
	   * @name produkRiwayatCtrl
	   * @param $rootScope {service} controller root scope
	   * @param $scope {service} controller scope
	   * @param $stateParams {service} controller state params
	   */

      angular.module('starter').controller('produkRiwayatCtrl', ['$rootScope', '$scope', '$stateParams', '$ionicLoading', "$http", '$ionicPopup', produkRiwayatCtrl]);

      function produkRiwayatCtrl($rootScope, $scope, $stateParams, $ionicLoading, $http, $ionicPopup){
          var vm = this;

          console.log("$stateParams", $stateParams);

      	/**
	     * Menjalankan parameter ketika ui tampil
	     * @memberof produkRiwayatCtrl
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
            if (!$rootScope.dataBusiness.logo) {
                $rootScope.dataBusiness.logo = "img/logobisnis.png";
            }
		  });


		  //deklarasi object sebagai parameter
		  var datas = {  
		  	token : localStorage.getItem("token"),
			device: localStorage.getItem("deviceUUID")			
		  };

		  //fungsi untuk menarik data dari server
		  $scope.loadData = function() {

		  	//munculkan loading
		  	$rootScope.ionicLoading([]);		

		  	//Load AJAX

		  	$http({
			        method: "POST",
			        url: config.server + "category/logs/"+$stateParams.id,
			        data: datas,
			        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			    
			    }) .success(function(feedback) {			    	
			        console.log("Response Data", feedback);

			      // Response sukses
			      if(feedback.success)
			        
			        {
			        	$scope.dataList = feedback;
			      		console.log("Log produklog", feedback.data)			      		
			      		$rootScope.ionicLoadingHide();								          
	          		} else {
	          			alert(feedback.message);
	          		}
	            }); //.error(function(feedback){
			    //     $ionicLoading.hide();

			    //     var alertPopup = $ionicPopup.alert({
			    //       title: 'Pemberitahuan',
			    //       template: feedback.message
			    //     });

			    //     alertPopup.then(function(res) {
			    //       $state.go($state.current, {}, {reload: true});
			    //     });
			    // });

	        //end of AJAX	

		  };
		  $scope.categoryproduk = $stateParams.nama;
		  $scope.loadData();

		  $scope.filter ={};

		 $scope.showx = function(x){
    		return x.product_id === $scope.filter.search || 
        		   x.user_id === $scope.filter.search;        		
		};


      };

})();