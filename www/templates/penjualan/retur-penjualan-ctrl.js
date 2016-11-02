(function() {
    'use strict';
    angular.module('starter').controller('returpenjualanCtrl', ['$rootScope', '$scope', returpenjualanCtrl]);

    function returpenjualanCtrl($rootScope, $scope) {
        var vm = this;

        // User Info Update
        $scope.$on('$ionicView.enter', function() {
            // SIMPAN SEMUA DATA USERssss
            // DATA USER
            $rootScope.dataUser = JSON.parse(localStorage.getItem("userInfo")).user;
            // DATA PROFILE
            $rootScope.dataProfile = JSON.parse(localStorage.getItem("userInfo")).profile;
            // DATA BUSINESS
            $rootScope.dataBusiness = JSON.parse(localStorage.getItem("userInfo")).business;
            // DATA ROLE
            $rootScope.dataRole = JSON.parse(localStorage.getItem("userInfo")).role;

            // Jika logo Bisnis kosong
            if (!$rootScope.dataBusiness.logo) {
                $rootScope.dataBusiness.logo = "img/logobisnis.png";
            }

            $scope.lists = [];
            $scope.temp = {};
            $scope.temp.search = "";
            $scope.temp.show_prod = false;
 
            $scope.data = {};
            $scope.data.tanggal = new Date();
            $scope.data.items = [];
        });

 
        $scope.search = function(){
        	$scope.temp.show_prod = false;
        	$scope.temp.sales_item = [];
        	$scope.data.items = [];
        	$rootScope.ionicLoading([]);
        	$rootScope.http('sales/search_invoice', {search : $scope.temp.search},
        		function(response){
        			if (response.success) {
        				$scope.lists = response.data;
        			}else{
        				$rootScope.toast(response.message);
        			};
        		}, function(){
        			$rootScope.toast('Gagal terhubung ke server.');
        		}, function(){
        			$rootScope.ionicLoadingHide();
        		}
        	);
        }

        $scope.select_item = function(index){
        	$scope.temp.show_prod = true;
        	$scope.temp.sales_item = $scope.lists[index].detail;
        	$scope.data.items = [];
            $scope.data.sales_id = $scope.lists[index].id;
        }

        $scope.prod_add = function(obj){
        	var check = false;
        	angular.forEach($scope.data.items, function(value, key){
        		if (value.id == obj.id) {
        			check = true;
        		};
        	});
        	
        	if (!check) {
        		obj.new_jumlah = obj.jumlah;
        		$scope.data.items.push(obj);
        	};
        }

        $scope.save = function(){
            if($scope.data.items.length < 1){
                return;
            };            
        	var check = true;
        	for (var i = 0; i < $scope.data.items.length; i++) {
        		if ($scope.data.items[i].new_jumlah > $scope.data.items[i].jumlah) {
        			$rootScope.toast("Jumlah barang yang diretur lebih besar dari penjualan sebelumnya!");
        			check = false;
        			break;
        		} else if($scope.data.items[i].new_jumlah < 1){
                    $rootScope.toast("Jumlah barang yang diretur minimal 1!");
                    check = false;
                    break;
                };
        	};

        	if (check) {
                $rootScope.ionicLoading([]);
        		$rootScope.http('sales/save_retur', $scope.data,
                    function(response){
                        if (response.success) {
                            $scope.data.tanggal = new Date();
                            $scope.data.items = [];
                            $scope.search();
                        }else{
                            $rootScope.toast(response.message);
                        };
                    },function(){
                        $rootScope.toast('Gagal terhubung ke server!');
                    },function(){
                        $rootScope.ionicLoadingHide();
                    }
                );
        	};
        }

        $scope.bind_pajak = function(e){
            if (!e || e == null) {
                return 0 + ' %';
            } else {
                var inPerc = e * 100;
                return inPerc + ' %';
            };
        };

    };

})();