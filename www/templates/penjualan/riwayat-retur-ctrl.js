(function() {

    'use strict';

    angular.module('starter').controller('riwayatReturCtrl', ['$rootScope', '$scope', '$state', riwayatReturCtrl]);

    function riwayatReturCtrl($rootScope, $scope, $state) {
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

                if($rootScope.dataRole.name=="salesman"){
                    $scope.data.salesman_id = localStorage.getItem("id");
                }


                $rootScope.ionicLoading(['warehouses','sales']);

                $rootScope.http('warehouses', {},
                    function(response){
                        if (response.success) {
                            $scope.warehouses = response.data;
                            $scope.warehouses.unshift({id : null, name : 'All'});

                            $rootScope.http('sales/search_retur', $scope.data,
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
                        }else{
                            $rootScope.ionicLoadingHide('sales');
                        };
                    }, function(){
                        $rootScope.toast('Gagal terhubung ke server');
                    }, function(){
                        $rootScope.ionicLoadingHide('warehouses');
                    }
                );
            };
        });
        
        $scope.bindTgl = function(e){
            if (!e || e == null) {
                var value = "Tanggal Kosong / Salah";
                return value;
            } else {
                var e = new Date(e);
                var dd = e.getDate();
                var mm = e.getMonth() + 1;
                var yy = e.getFullYear();
                var fullDate = dd +"/"+ mm +"/"+ yy;
                return fullDate;
            };            
        }

        $scope.tampilkan = function(){
            $rootScope.ionicLoading([]);
            $rootScope.http('sales/search_retur', $scope.data,
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
                $state.go('pos.detail-retur',{param: data});
            };
            console.log('href',data);
        }
    };

})();