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

    angular.module('starter').controller('detailReturCtrl', ['$rootScope', '$scope', '$state','$stateParams', detailReturCtrl]);

    function detailReturCtrl($rootScope, $scope, $state, $stateParams) {
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
                $rootScope.dataBusiness.logo = "img/ionic.png";
            }

            // DATA ROLE
            $rootScope.dataRole = JSON.parse(localStorage.getItem("userInfo")).role;

            $rootScope.setting = JSON.parse(localStorage.getItem("setting"));

            $scope.data = $stateParams.param;
            $scope.data.tanggal = new Date($scope.data.tanggal);


            console.log($scope.data);
        });
    };

})();