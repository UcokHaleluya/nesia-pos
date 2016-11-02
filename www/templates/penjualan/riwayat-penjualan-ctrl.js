(function() {

    'use strict';

    angular.module('starter').controller('riwayatPenjualanCtrl', ['$rootScope', '$scope', '$state', riwayatPenjualanCtrl]);

    function riwayatPenjualanCtrl($rootScope, $scope, $state) {
        var vm = this;

        $scope.data = {};

        // User Info Update
        $scope.$on('$ionicView.enter', function(event, data) {
            // SIMPAN SEMUA DATA USER

            if (data.direction != 'back') {
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

                $scope.data.date_from = new Date();
                $scope.data.date_to = new Date();
                $scope.data.warehouse_id = null;
                $scope.data.salesman_id = null;

                $rootScope.ionicLoading(['warehouses','sales','salesman']);
                if ($rootScope.dataRole.name == 'admin') {
                    $rootScope.http('contacts', {user_id: localStorage.getItem('id')},
                        function(response) {
                            if (response.success) {
                                // Ambil data kontak
                                $scope.salesmen = response.data.salesmen;
                                $scope.salesmen.unshift({
                                    user_id: 0,
                                    name: "Toko"
                                });
                                $scope.salesmen.unshift({
                                    user_id: null,
                                    name: "All"
                                });
                            } else {
                                // Popup pesan respon
                                $rootScope.ionicAlert($ionicPopup, response.message);
                            }
                        },
                        function() { // error
                            $rootScope.toast("Gagal terhubung ke server");
                        },
                        function() { // complete
                            $rootScope.ionicLoadingHide('salesman');
                        }
                    );
                }else{
                    $rootScope.ionicLoadingHide('salesman');
                    $scope.data.salesman_id = localStorage.getItem('id');
                };

                $rootScope.http('warehouses', {},
                    function(response){
                        if (response.success) {
                            $scope.warehouses = response.data;
                            $scope.warehouses.unshift({id : null, name : 'All'});

                            $rootScope.http('sales/detail', $scope.data,
                                function(response){
                                    if (response.success) {
                                        $scope.lists = response.data;
                                    };
                                },function(){
                                    $rootScope.toast('Gagal terhubung ke server');
                                },function(){
                                    $rootScope.ionicLoadingHide('sales');
                                }
                            );
                        };
                    }, function(){
                        $rootScope.toast('Gagal terhubung ke server');
                    }, function(){
                        $rootScope.ionicLoadingHide('warehouses');
                    }
                );
            };
        });
		

		$scope.tampilkan = function(){
			$rootScope.ionicLoading([]);
			$rootScope.http('sales/detail', $scope.data,
				function(response){
					if (response.success) {
						$scope.lists = response.data;
					};
				},function(){
					$rootScope.toast('Gagal terhubung ke server');
				},function(){
					$rootScope.ionicLoadingHide();
				}
			);
		}

        $scope.href = function(data){
            if (data) {
                $state.go('pos.detail-penjualan',{param: data});
            };
        }
	};

})();