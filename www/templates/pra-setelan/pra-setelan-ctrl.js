(function() {

    'use strict';

    /**
     * @memberof starter
     * @ngdoc controller
     * @name praSetelanCtrl
     * @param $rootScope {service} controller root scope
     * @param $scope {service} controller scope
     * @param $cordovaCamera {service} controller cordova camera
     * @param $http {service} controller http
     * @param $ionicLoading {service} controller ionic loading
     * @param $state {service} controller state
     * @param $ionicHistory {service} controller ionic history
     * @param $ionicPopup {service} controller ionic popup
     */

    angular.module('starter').controller('praSetelanCtrl', ['$rootScope', '$scope', '$cordovaCamera', '$cordovaImagePicker', '$http', '$ionicLoading', '$state', '$ionicHistory', '$ionicPopup', '$location', praSetelanCtrl]);

    function praSetelanCtrl($rootScope, $scope, $cordovaCamera, $cordovaImagePicker, $http, $ionicLoading, $state, $ionicHistory, $ionicPopup, $location) {

        /**
         * @property {Hash} vm collection og objects that belongs to this prasetelan controller
         */
        var vm = this;

        // User Info Update
        $scope.$on('$ionicView.enter', function() {
            // SIMPAN SEMUA DATA USER
            // DATA USER
            $rootScope.dataUser = JSON.parse(localStorage.getItem("userInfo")).user;
            // DATA PROFILE
            $rootScope.dataProfile = JSON.parse(localStorage.getItem("userInfo")).profile;
            // DATA BUSINESS
            $rootScope.dataBusiness = JSON.parse(localStorage.getItem("userInfo")).business;
            // DATA ROLE
            $rootScope.dataRole = JSON.parse(localStorage.getItem("userInfo")).role;

            $ionicHistory.nextViewOptions({
                disableBack: true
            });
        });

        var filePath = null;

        $scope.praSetelanData = {};
        $scope.praSetelanDataError = false;
        $scope.praSetelanDataErrorText;
        $scope.images = 'img/logobisnis.png';
        /**
         * Ambil logo bisnis
         * @memberof praSetelanCtrl
         * @function ambilLogoBisnis
         */



        $scope.ambilLogoBisnis = function() {
            $scope.data = {}

            var unggahLogoBisnisPopup = $ionicPopup.show({

                template: 'Pilih sumber foto',
                title: 'Unggah logo bisnis',
                subTitle: '',
                scope: $scope,
                buttons: [{
                    text: '<button class="btn btn-md btn-transparant">' +
                        '<i class="fa fa-camera-retro" ></i><br/><b>KAMERA</b>' +
                        '</button>',
                    type: 'button-positive',
                    onTap: function(e) {
                        return $scope.data = "1";
                    }
                }, {
                    text: '<button class="btn btn-md btn-transparant">' +
                        '<i class="ion-images"></i><br/><b>GALERI</b>' +
                        '</button>',
                    type: 'button-positive',
                    onTap: function(e) {
                        return $scope.data = "0";
                    }
                }, ]
            });

            unggahLogoBisnisPopup.then(function(res) {
                if (res) {
                    // alert($scope.data);
                    document.addEventListener("deviceready", function() {
                        var options = {
                            quality: 100,
                            destinationType: Camera.DestinationType.DATA_URL,
                            sourceType: $scope.data,
                            allowEdit: true,
                            encodingType: Camera.EncodingType.JPEG,
                            targetWidth: 128,
                            targetHeight: 128,
                            popoverOptions: CameraPopoverOptions,
                            saveToPhotoAlbum: false,
                            correctOrientation: true
                        };

                        $cordovaCamera.getPicture(options).then(function(imageData) {
                            var image = document.getElementById('logoBisnis');
                            image.src = "data:image/jpeg;base64," + imageData;
                            $scope.images = image.src;
                            //Kirim semua data foto Admin
                        }, function(err) {
                            $rootScope.toast("Gagal terhubung ke server");
                        });
                    }, false);

                } else {

                }
            });
        };

        /**
         * Simpan pra setelan
         * @memberof praSetelanCtrl
         * @function simpanPraSetelan
         */
        $scope.simpanPraSetelan = function() {

            // Set variabel token dan nama bisnis
            var token = localStorage.getItem('token');
            var name = $scope.praSetelanData.namaBisnis;

            // Jika sudah mengisi nama bisnis
            if (name != null || name != undefined || filePath != null || filePath != undefined) {

                // Loading mengunggah
                $rootScope.ionicLoading([]);

                // Data yang dikirim ke server
                var images = null;
                if ($scope.images != "img/logobisnis.png") {
                    images = $scope.images;
                };

                var data = {
                    name: name,
                    logo: images,
                }

                // Cetak data yang dikirim ke server
                console.log(data);
                // Pemanggilan AJAX
                $rootScope.http("user/set-business", data,
                    function(response) {
                        if (response.success) {
                            // Mencegah tombol back
                            $ionicHistory.nextViewOptions({
                                disableBack: false
                            });
                            // Hilangkan loading mengunggah
                            $ionicLoading.hide();
                            // Popup berhasil mendaftar
                            var alertPopup = $ionicPopup.alert({
                                title: 'Pemberitahuan',
                                template: 'Terima kasih telah mendaftar. Silahkan Login kembali.'
                            });

                            // Redirect ke login
                            alertPopup.then(function(res) {
                                $location.url('/app/login', true);
                                //$state.go('app.login');		              
                            });
                        } else {
                            $rootScope.toast(response.message);
                        }
                    },
                    function() {
                        // Popup unggah gagal
                        var alertPopup = $ionicPopup.alert({
                            title: 'Pemberitahuan',
                            template: 'Unggah gagal!'
                        });

                        // Redirect ke pra setelan
                        alertPopup.then(function(res) {
                            $state.go('app.pra-setelan');
                        });

                        $scope.praSetelanDataError = true;
                        $scope.praSetelanDataErrorText = error.data.error;
                        console.log($scope.praSetelanDataErrorText);
                    },
                    function() {
                        $rootScope.ionicLoadingHide();
                    }
                );

            } else {
                // Popup belum mengisi nama bisnis
                var alertPopup = $ionicPopup.alert({
                    title: 'Pemberitahuan',
                    template: 'Anda belum mengisi Nama Bisnis dan Logo Bisnis!'
                });
            }

        };
    };
    // Jika belum mengisi nama bisnis
})();