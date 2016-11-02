(function () {

      'use strict';

      /**
	   * @memberof starter
	   * @ngdoc controller
	   * @name menuUtamaCtrl
	   * @param $rootScope {service} controller root scope
	   * @param $scope {service} controller scope
	   * @param $ionicHistory {service} controller ionic history
	   */

      angular.module('starter').controller('menuUtamaCtrl', ['$rootScope', '$scope', '$ionicHistory', menuUtamaCtrl]);

      function menuUtamaCtrl($rootScope, $scope, $ionicHistory){

      	/**
     	* @property {Hash} vm collection og objects that belongs to this menu utama controller
     	*/	
          var vm = this;

		  $ionicHistory.nextViewOptions({
		    disableBack: true
		  });

	  	/**
	     * Menjalankan parameter ketika ui tampil
	     * @memberof produkCtrl
	     * @function $scope.$on
	     * @$ionicView.enter {Service} memasuki ui
	     */
	     
		  // User Info Update
		  $scope.$on('$ionicView.enter', function() {
		    // SIMPAN SEMUA DATA USER
		    $rootScope.checkWarehouseStatus();
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
		    $rootScope.ionicLoading([]);
		    $scope.daily = {};
		    $scope.daily.retur = {};
		    $scope.daily.retur.omzet = 0;
		    $scope.daily.grafik = {};
		    $scope.weekly = {};
		    $scope.weekly.retur = {};
		    $scope.weekly.retur.omzet = 0;
		    $scope.weekly.grafik = {};
		    $scope.monthly = {};
		    $scope.monthly.retur = {};
		    $scope.monthly.retur.omzet = 0;
		    $scope.monthly.grafik = {};		    
		    $rootScope.http('dashboard', {},
		    	function(response){
		    		if (response.success) {
		    			var daily = response.data.daily;
		    			$scope.daily.grafik.data = [daily.grafik.data];
		    			$scope.daily.grafik.labels = daily.grafik.label;
		    			$scope.daily.table = daily.table;
		    			$scope.daily.retur = daily.retur;
		    			if (!daily.retur) {
		    				$scope.daily.retur = {};
		    				$scope.daily.retur.omzet = 0;
		    			};

		    			var weekly = response.data.weekly;
		    			$scope.weekly.grafik.data = [weekly.grafik.data];
		    			$scope.weekly.grafik.labels = weekly.grafik.label;
		    			$scope.weekly.table = weekly.table;
		    			$scope.weekly.retur = weekly.retur;
		    			if (!weekly.retur) {
		    				$scope.weekly.retur = {};
		    				$scope.weekly.retur.omzet = 0;
		    			};

		    			var monthly = response.data.monthly;
		    			$scope.monthly.grafik.data = [monthly.grafik.data];
		    			$scope.monthly.grafik.labels = monthly.grafik.label;
		    			$scope.monthly.table = monthly.table;
		    			$scope.monthly.retur = monthly.retur;
		    			if (!monthly.retur) {
		    				$scope.monthly.retur = {};
		    				$scope.monthly.retur.omzet = 0;
		    			};

		    			$scope.best_customer = response.data.best_customer;

		    			var default_tax = response.data.default_tax;
		    			localStorage.setItem("default_tax", JSON.stringify(default_tax));
		    		};
		    	},function(){

		    	},function(){
		    		$rootScope.ionicLoadingHide();
		    	}
		    );	    
			
			var setting = localStorage.getItem('setting');
			if (setting) {
				$scope.setting = JSON.parse(setting);
			};

		    var firstLogin = 1;
		    var Prod_ware = localStorage.getItem("Prod-ware");
		    if (Prod_ware || Prod_ware != null) {
		    	firstLogin = 0;
		    };
		    localStorage.setItem('isFirstLogin', firstLogin);		    
		  });
			
		  // Calendar
		  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
		  var date = new Date();
		  var day = date.getDate();
		  var month = date.getMonth();
		  var yy = date.getYear();
		  var year = (yy < 1000) ? yy + 1900 : yy;

		  // Set tanggal sekarang
		  $scope.tanggal = day + "/" + months[month] + "/" + year +" - ";

		  var d = new Date();
		  var curr_hour = d.getHours();
		  var curr_min = d.getMinutes();
		  curr_min = curr_min + "";
		  if (curr_min.length == 1) {
		      curr_min = "0" + curr_min;
		  }

		  $scope.tanggal += curr_hour + " : " + curr_min;

		  // Chart
		  $scope.labels = ["3 Nov", "4 Nov", "5 Nov", "6 Nov", "7 Nov"];
		  $scope.series = ['Series A', 'Series B'];
		  $scope.data = [
		      [2, 13, 8, 4, 1, 8, 3],
		      [15, 6, 18, 11, 12, 9, 7]
		  ];


		  $scope.doRefresh = function(){
		  	 $rootScope.http('dashboard', {},
		    	function(response){
		    		if (response.success) {		    			
		    			var daily = response.data.daily;
		    			$scope.daily.grafik.data = [daily.grafik.data];
		    			$scope.daily.grafik.labels = daily.grafik.label;
		    			$scope.daily.table = daily.table;

		    			var weekly = response.data.weekly;
		    			$scope.weekly.grafik.data = [weekly.grafik.data];
		    			$scope.weekly.grafik.labels = weekly.grafik.label;
		    			$scope.weekly.table = weekly.table;

		    			var monthly = response.data.monthly;
		    			$scope.monthly.grafik.data = [monthly.grafik.data];
		    			$scope.monthly.grafik.labels = monthly.grafik.label;
		    			$scope.monthly.table = monthly.table;

		    			var default_tax = response.data.default_tax;
		    			localStorage.setItem("default_tax", JSON.stringify(default_tax));

		    		};
		    	}, function(){}
		    	, function(){
		    		$scope.$broadcast('scroll.refreshComplete');
		    	}
		    );
		  };
      };

})();