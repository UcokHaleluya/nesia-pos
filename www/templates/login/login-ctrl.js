(function() {

    'use strict';

    /**
     * @memberof starter
     * @ngdoc controller
     * @name loginCtrl
     * @param $rootScope {service} controller root scope
     * @param $scope {service} controller scope
     * @param $http {service} controller http
     * @param $ionicLoading {service} controller ionic loading
     * @param $state {service} controller state
     * @param $ionicHistory {service} controller ionic history
     * @param $ionicPopup {service} controller ionic popup
     */

    angular.module('starter').controller('loginCtrl', ['$rootScope', '$scope', '$http', '$ionicLoading', '$state', '$ionicHistory', '$ionicNavBarDelegate', '$ionicPopup', loginCtrl]);

    function loginCtrl($rootScope, $scope, $http, $ionicLoading, $state, $ionicHistory, $ionicNavBarDelegate, $ionicPopup) {
        /**
         * @property {Hash} vm collection og objects that belongs to this login controller
         */
        var vm = this;

        $scope.loginData = {};
        $scope.loginError = false;
        $scope.loginErrorText;

        $scope.error = {};
        $scope.error.show = "none";
        $scope.error.message = "";

        
        $scope.showPassword = false;
          $scope.toggleShowPassword = function() {
            $scope.showPassword = !$scope.showPassword;
          }
        $scope.$on('$ionicView.enter', function() {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });            
        $ionicHistory.clearHistory();
        $ionicNavBarDelegate.showBackButton(false);        
        $ionicHistory.clearCache();
        $scope.loginData = {};        
        $rootScope.warehouseStatus = 0;
        });


        /**
         * User login
         * @memberof loginCtrl
         * @function login
         */
        $scope.login = function() {

        	$scope.error.show = "none";
			$scope.error.message = "";
            // Loading masuk
            $rootScope.ionicLoading(['login','setting']);

            // Data yang dikirim ke server
            var data = {
                user_id: $scope.loginData.user_id,
                password: $scope.loginData.password,
                ingatSaya: $scope.loginData.ingatSaya,
                device: localStorage.getItem("deviceUUID")
            }

            // Cetak data yang dikirim
            console.log("Data Login", data);

            // Pemanggilan AJAX
            $rootScope.http("user/login", data,
                function(response){
                    if (response.success) {

                        // Simpan semua respon mengenai data user ke dalam local storage
                        var dataUser = response.data;
                        var id = response.data.user.id;
                        var user_id = response.data.user.user_id;
                        var password = $scope.loginData.password;
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
                                    $scope.currentUser = user_id;

                                    // Kode untuk ingat saya
                                    if ($scope.loginData.ingatSaya) {
                                        $scope.loginData.user_id = localStorage.getItem("user_id");
                                        $scope.loginData.password = localStorage.getItem("password");
                                    } else {
                                        $scope.loginData.user_id = undefined;
                                        $scope.loginData.password = undefined;
                                    }
                                    
                                    if (dataUser.user.activation_status) {
                                        $state.go('pos.menu-utama');
                                    }else{
                                        $state.go('app.verifikasi');
                                    };
                                }, undefined,
                                function(){
                                    $rootScope.ionicLoadingHide('setting');
                                }
                            );
                        }else{
                            $rootScope.ionicLoadingHide('setting');
                            $state.go('app.pra-setelan');
                        };
                    }
                    // Response gagal  
                    else {
                        // Hilangkan loading masuk
                        $scope.error.show = "block";
                        $scope.error.message = response.message;
                        $rootScope.ionicLoadingHide('setting');
                    }
                },
                function(){
                    $scope.error.show = "block";
                    $scope.error.message = "Gagal Terhubung Ke Server!";
                    $rootScope.ionicLoadingHide('setting');
                },
                function(){
                    $rootScope.ionicLoadingHide('login');
            });
     //        $http({
     //                method: "POST",
     //                url: config.server + "user/login",
     //                data: data,
     //                headers: {
     //                    'Content-Type': 'application/x-www-form-urlencoded'
     //                }
     //            })
     //            // Terhubung ke server
     //            .success(function(response) {

     //                // Cetak respon pemanggilan AJAX
     //                console.log("Response Data Login", response);

     //                // Response sukses
     //                if (response.success) {

     //                    // Simpan semua respon mengenai data user ke dalam local storage
     //                    var dataUser = response.data;
     //                    var id = response.data.user.id;
     //                    var user_id = response.data.user.user_id;
     //                    var password = $scope.loginData.password;
     //                    var token = response.data.user.token;
     //                    var name = response.data.profile.name;


     //                    localStorage.setItem("userInfo", JSON.stringify(dataUser));
     //                    localStorage.setItem('user_id', user_id);
     //                    localStorage.setItem('token', token);
     //                    localStorage.setItem('name', name);
     //                    localStorage.setItem('id', id);

     //                    //get setting business
     //                    $http({
     //                        method : "POST",
     //                        url : config.server + "user/setting/" + dataUser.business.id,
     //                        data : {
     //                            token : token,
     //                            device : localStorage.getItem("deviceUUID")
     //                        },
     //                        headers: {
     //                            'Content-Type': 'application/x-www-form-urlencoded'
     //                        }
     //                    }).then(function(response){
     //                        localStorage.setItem('setting', JSON.stringify(response.data.data.preferensi));
     //                    });

     //                    $scope.currentUser = user_id;

     //                    // Kode untuk ingat saya
     //                    if ($scope.loginData.ingatSaya) {
     //                        $scope.loginData.user_id = localStorage.getItem("user_id");
     //                        $scope.loginData.password = localStorage.getItem("password");
     //                    } else {
     //                        $scope.loginData.user_id = undefined;
     //                        $scope.loginData.password = undefined;
     //                    }

     //                    // Popup login berhasil
     //                    $state.go('pos.menu-utama');

     //                }
     //                // Response gagal  
     //                else {
     //                    // Hilangkan loading masuk
     //                    $rootScope.ionicLoadingHide();
					// 	$scope.error.show = "block";
					// 	$scope.error.message = response.message;
     //                }
     //            })
     //            // Gagal terhubung ke server (tidak ada koneksi)
     //            .error(function() {
     //                $rootScope.ionicLoadingHide();
     //            	$scope.error.show = "block";
					// $scope.error.message = "Gagal Terhubung Ke Server!";

     //            });

        };
    };

})();