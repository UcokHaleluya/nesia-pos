(function() {

    'use strict';

    /**
     * @memberof starter
     * @ngdoc controller
     * @name splashCtrl
     * @param $rootScope {service} controller root scope
     * @param $scope {service} controller scope
     * @param $http {service} controller http
     * @param $ionicLoading {service} controller ionic loading
     * @param $state {service} controller state
     * @param $ionicHistory {service} controller ionic history
     * @param $ionicPopup {service} controller ionic popup
     */

    angular.module('starter').controller('splashCtrl', ['$rootScope', '$scope', '$http', '$ionicLoading', '$state', '$timeout', '$ionicHistory', splashCtrl]);

    function splashCtrl($rootScope, $scope, $http, $ionicLoading, $state, $timeout, $ionicHistory) {
        /**
         * @property {Hash} vm collection og objects that belongs to this login controller
         */
        var vm = this;

        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        var orientation = localStorage.getItem('orientation');
        if (orientation == null) {
            localStorage.setItem('orientation', 'portrait');
        };

        $rootScope.checkWarehouseStatus();


        $timeout(function () {
            var token = localStorage.getItem('token');
            if (token) {
                $rootScope.ionicLoading(['token','setting']);

                $rootScope.http('user/check_token', {},
                    function(response){
                        if (response.success) {
                            var dataUser = response.data;
                            var id = response.data.user.id;
                            var user_id = response.data.user.user_id;
                            var token = response.data.user.token;
                            var name = response.data.profile.name;


                            localStorage.setItem("userInfo", JSON.stringify(dataUser));
                            localStorage.setItem('user_id', user_id);
                            localStorage.setItem('token', token);
                            localStorage.setItem('name', name);
                            localStorage.setItem('id', id);

                            //get setting business
                            if (dataUser.business) {
                                $rootScope.http("user/setting/" + dataUser.business.id, {}, 
                                    function(res){
                                    localStorage.setItem('setting', JSON.stringify(res.data.preferensi));
                                    $scope.currentUser = user_id;

                                    // Popup login berhasil
                                    if (dataUser.user.activation_status) {
                                        $state.go('pos.menu-utama');
                                    }else{
                                        $state.go('app.verifikasi');
                                    };
                                }, undefined,
                                function(){
                                    $rootScope.ionicLoadingHide('setting');
                                });
                            }else{
                                $rootScope.ionicLoadingHide('setting');
                                $state.go('app.pra-setelan');
                            };                        
                        }else{
                            $rootScope.toast(response.message);
                            localStorage.removeItem("token");
                            $rootScope.ionicLoadingHide('setting');
                            $state.go("app.login");
                        };
                    },function(){
                        $rootScope.toast('Gagal terhubung ke server');
                    },function(){
                        $rootScope.ionicLoadingHide('token');
                    }
                );
            }else{
                $state.go('app.login');
            };
        }, 1000);

    //});
    };

})();