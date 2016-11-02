(function() {

    'use strict';

    /**
     * @memberof starter
     * @ngdoc controller
     * @name penjualanDetailCtrl
     * @param $rootScope {service} controller root scope
     * @param $scope {service} controller scope
     * @param $ionicPopup {service} controller ionic poup
     */

    angular.module('starter').controller('penjualanDetailCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$ionicPopup', penjualanDetailCtrl]);

    function penjualanDetailCtrl($rootScope, $scope, $state, $stateParams, $ionicPopup) {
        /**
         * @property {Hash} vm collection og objects that belongs to this penjualan controller
         */
        var vm = this;

        /**
         * Menjalankan parameter ketika ui tampil
         * @memberof penjualanDetailCtrl
         * @function $scope.$on
         * @$ionicView.enter {Service} memasuki ui
         */
        // User Info Update
        $scope.$on('$ionicView.enter', function(event, data) {

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

            // DATA ROLE
            $rootScope.dataRole = JSON.parse(localStorage.getItem("userInfo")).role;

            $rootScope.setting = JSON.parse(localStorage.getItem("setting"));

            $scope.data = $stateParams.param;
            $scope.data.tanggal = new Date($scope.data.tanggal);

            $scope.data.sub_total_1 = parseInt($scope.data.sub_total_1);
            $scope.data.sub_total_2 = parseInt($scope.data.sub_total_2);

            $scope.data.pajak_1_price = $scope.data.sub_total_1 * $scope.data.pajak_1;
            if ($scope.data.pajak_2_type == 2) {
                $scope.data.pajak_2_price = $scope.data.sub_total_1 * ($scope.data.pajak_2 * 0.01);
            } else {
                $scope.data.pajak_2_price = $scope.data.pajak_2;
            };

            if ($scope.data.discount_type == 2) {
                $scope.data.discount_price = $scope.data.sub_total_1 * ($scope.data.discount * 0.01);
            } else {
                $scope.data.discount_price = $scope.data.discount;
            };

            $scope.data.customer = ($scope.data.customer == null)? 'Cash' : $scope.data.customer;
            $scope.data.sales = ($scope.data.sales == null)? 'Toko' : $scope.data.sales;

            console.log($scope.data);
        });

        //kirim Email
        $scope.kirimEmail = function() {
            var myPopup = $ionicPopup.show({
                template: 'Apakah Anda ingin mengirimkan faktur ke email pelanggan ?</p>',
                title: 'Konfirmasi',
                scope: $scope,
                buttons: [{
                    text: 'Tidak',
                    onTap: function(e) {}
                }, {
                    text: 'Ya',
                    type: 'button-positive',
                    onTap: function(e) {
                        $rootScope.ionicLoading([]); 
                        $rootScope.http('/sales/send_invoice_email', {sales_id : $scope.data.id},
                            function(response) {
                                if (response.success) {
                                    $rootScope.toast('Faktur sudah terkirim');                
                                }else{
                                    $rootScope.toast(response.message);    
                                };
                            },
                            function() {
                                $rootScope.toast('Gagal terhubung ke server');
                            },
                            function() {
                                $rootScope.ionicLoadingHide();
                            }
                        );

                    }
                }]

            })
        }
    };



})();