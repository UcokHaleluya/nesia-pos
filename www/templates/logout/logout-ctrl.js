(function() {

    'use strict';

    /**
     * @memberof starter
     * @ngdoc controller
     * @name logoutCtrl
     * @param $http {service} controller http
     * @param $rootScope {service} controller root scope
     * @param $state {service} controller state
     * @param $scope {service} controller scope
     * @param $ionicLoading {service} controller ionic loading
     * @param $ionicHistory {service} controller ionic history
     * @param $ionicPopup {service} controller ionic popup
     */

    angular.module('starter').controller('logoutCtrl', ['$http', '$rootScope', '$state', '$scope', '$ionicLoading', '$ionicHistory', '$ionicPopup', logoutCtrl]);

    function logoutCtrl($http, $rootScope, $state, $scope, $ionicLoading, $ionicHistory, $ionicPopup) {
        /**
         * @property {Hash} vm collection og objects that belongs to this logout controller
         */
        var vm = this;

        /**
         * User keluar dari sistem
         * @memberof logoutCtrl
         * @function logout
         */
        $rootScope.logout = function() {

            var confirmPopup = $ionicPopup.show({

                template: 'Apakah Anda yakin ingin keluar?',
                title: 'Pemberitahuan',
                scope: $scope,
                buttons: [{
                    text: 'Batal',
                    onTap: function(e) {}

                }, {
                    text: 'Keluar',
                    type: 'button-positive',
                    onTap: function(e) {

                        // Loading keluar
                        $rootScope.ionicLoading([]);

                        // Data yang dikirim ke server
                        var data = {
                            token: localStorage.getItem('token'),
                            device: localStorage.getItem("deviceUUID")
                            // orientation : localStorage.getItem('orientation')
                        }

                        // Pemanggilan AJAX
                        $rootScope.http('user/logout', data,
                            function(response) {
                                if (response.success) {
                                    var keys = Object.keys(localStorage),
                                        i = keys.length;

                                    while (i--) {
                                        if (keys[i] != 'deviceUUID' && keys[i] != 'orientation' && keys[i] != 'theme') {
                                            localStorage.removeItem(keys[i]);
                                        };
                                    }

                                    // Set url bank kembali ke awal
                                    $rootScope.url = config.server + 'user/bank/save';

                                    // Set data password dan data bank undefined
                                    $rootScope.dataPassword = undefined;
                                    $rootScope.dataBank = undefined;

                                    // Mencegah tombol back
                                    $ionicHistory.nextViewOptions({
                                        disableBack: false
                                    });

                                    // Hilangkan loading keluar
                                    $rootScope.ionicLoadingHide();
                                    $state.go('app.login');
                                } else {
                                    $rootScope.ionicLoadingHide();
                                    $rootScope.toast(response.message);
                                }
                            },
                            function() {
                                $rootScope.ionicLoadingHide();
                                $rootScope.toast("Gagal terhubung ke server");
                            }
                        );
                    }
                }, ]
            });


            // Popup konfirmasi untuk keluar

        };

    };

})();