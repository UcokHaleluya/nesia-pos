(function() {

    'use strict';

    /**
     * @memberof starter
     * @ngdoc controller
     * @name daftarCtrl
     * @param $scope {service} controller scope
     * @param $http {service} controller http
     * @param $ionicLoading {service} controller ionic loading
     * @param $state {service} controller state	
     * @param $ionicHistory {service} controller ionic history
     * @param $ionicPopup {service} controller ionic popup
     */

    angular.module('starter').controller('daftarCtrl', ['$scope', '$rootScope', '$http', '$ionicLoading', '$state', '$ionicHistory', '$ionicPopup', daftarCtrl]);

    function daftarCtrl($scope, $rootScope, $http, $ionicLoading, $state, $ionicHistory, $ionicPopup) {
        /**
         * @property {Hash} vm collection og objects that belongs to this daftar controller
         */
        var vm = this;

        $scope.validation = {} 

        $scope.daftarData = {};
        $scope.daftarError = false;
        $scope.daftarErrorText;
        $scope.error = {};


        $scope.$on('$ionicView.enter', function() {
        	$ionicHistory.nextViewOptions({
	            disableBack: true
	        });
            $scope.daftarData = {};
        });

        /**
         * User mendaftar ke sistem
         * @memberof daftarCtrl
         * @function daftar
         */
        $scope.daftar = function() {
            // Loading daftar
            $rootScope.ionicLoading({});

            // Data yang dikirim ke server
            var credentials = {
                user_id: $scope.daftarData.user_id,
                password: $scope.daftarData.password,
                name: $scope.daftarData.name,
                email: $scope.daftarData.email,
                gender: $scope.daftarData.gender,
                device: localStorage.getItem("deviceUUID")
            }

            // Cetak data yang dikirim ke server
            console.log(credentials);

            // Pemanggilan AJAX
            $http({
                    method: "POST",
                    url: config.server + "user/register",
                    data: credentials,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                // Terhubung ke server
                .success(function(response) {
                    // Cetak respon server
                    console.log(response);
                    // Jika respon sukses
                    if (response.success) {

                        // Simpan data user ke dalam local storage
                        var dataUser = response.data;
                        var user_id = response.data.user.user_id;
                        var password = $scope.daftarData.password;
                        var token = response.data.user.token;
                        var name = response.data.profile.name;

                        localStorage.setItem("userInfo", JSON.stringify(dataUser));
                        localStorage.setItem('user_id', user_id);
                        localStorage.setItem("password", password);
                        localStorage.setItem('token', token);
                        localStorage.setItem('name', name);

                        $scope.currentUser = user_id;

                        // Mencegah tombol back
                        $ionicHistory.nextViewOptions({
                            disableBack: false
                        });

                        // Hilangkan loading daftar
                        $ionicLoading.hide();

                        // Popup daftar berhasil
                        var alertPopup = $ionicPopup.alert({
                            title: 'Pemberitahuan',
                            template: 'Daftar berhasil!'
                        });
                        $scope.daftarData = {};
                        // Redirect ke pra setelan
                        alertPopup.then(function(res) {
                            $state.go('app.pra-setelan');
                        });

                    }
                    // Jika respon gagal
                    else {
                        // Hilangkan loading daftar
                        $rootScope.ionicLoadingHide();
                        $scope.error.show = true;
                        $scope.error.message = response.message;

                        // Popup pesan respon
                        /*var alertPopup = $ionicPopup.alert({
                            title: 'Pemberitahuan',
                            template: response.message
                        });*/

                        // Redirect ke daftar
                        /*alertPopup.then(function(res) {
                            $state.go('app.daftar');
                        });*/

                    }
                })
                // Gagal terhubung ke server (tidak ada koneksi)
                .error(function() {

                    // Hilangkan loading daftar
                    $ionicLoading.hide();

                    // Popup daftar gagal
                    var alertPopup = $ionicPopup.alert({
                        title: 'Pemberitahuan',
                        template: 'Daftar gagal!'
                    });

                    // Redirect ke daftar
                    alertPopup.then(function(res) {
                        $state.go('app.daftar');
                    });

                    $scope.daftarError = true;
                    $scope.daftarErrorText = error.data.error;
                    console.log($scope.daftarErrorText);
                });

        };

        $scope.validate = function(){
        }

    };

})();