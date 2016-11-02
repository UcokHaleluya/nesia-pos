(function() {

    'use strict';

    /**
     * @memberof starter
     * @ngdoc controller
     * @name verifikasiCtrl
     * @param $rootScope {service} controller root scope
     * @param $scope {service} controller scope
     * @param $http {service} controller http
     * @param $ionicLoading {service} controller ionic loading
     * @param $state {service} controller state
     * @param $ionicHistory {service} controller ionic history
     * @param $ionicPopup {service} controller ionic popup
     */

    angular.module('starter').controller('verifikasiCtrl', ['$rootScope', '$scope', '$http', '$ionicLoading', '$state', '$ionicHistory', '$ionicPopup', verifikasiCtrl]);

    function verifikasiCtrl($rootScope, $scope, $http, $ionicLoading, $state, $ionicHistory, $ionicPopup) {
        /**
         * @property {Hash} vm collection og objects that belongs to this login controller
         */
        var vm = this;

        $scope.data = {};

        $scope.error = {};
        $scope.error.show = "none";
        $scope.error.message = "";

        $scope.$on('$ionicView.enter', function() {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
        });

        /**
         * User login
         * @memberof verifikasiCtrl
         * @function login
         */
        $scope.submit = function() {
            $rootScope.ionicLoading([]);
            $scope.error.show = "none";
            $rootScope.http('user/verification', $scope.data,
                function(response){
                    if (response.success) {
                        localStorage.setItem("userInfo", JSON.stringify(response.data));
                        $state.go('prapendaftaran');
                    }else{
                        $scope.error.show = "block";
                        $scope.error.message = response.message;
                    };
                },
                function(){
                    $rootScope.toast('Gagal terhubung ke server.');
                },
                function(){
                    $rootScope.ionicLoadingHide();
                }
            );
        };

        $scope.sendCode = function() {
             $rootScope.ionicLoading([]);
            $scope.error.show = "none";
            $rootScope.http('user/send-verification', $scope.data,
                function(response){
                    if (response.success) {
                        $rootScope.toast('Kode sudah dikirim');
                    }else{
                        $rootScope.toast(response.message);
                    };
                },
                function(){
                    $rootScope.toast('Gagal terhubung ke server');
                },
                function(){
                    $rootScope.ionicLoadingHide();
                }
            );
        };
    };

})();