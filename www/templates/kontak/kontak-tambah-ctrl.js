(function() {

   'use strict';

   /**
    * @memberof starter
    * @ngdoc controller
    * @name kontakTambahCtrl
    * @param $state {service} controller state
    * @param $http {service} controller http
    * @param $cordovaCamera {service} controller cordova camera
    * @param $ionicLoading {service} controller ionic loading
    * @param $filter {service} controller ionic filter
    * @param $ionicPopup {service} controller ionic popup
    * @param $rootScope {service} controller root scope
    * @param $scope {service} controller scope	   
    */

   angular.module('starter').controller('kontakTambahCtrl', ['$state', '$http', '$cordovaCamera', '$ionicLoading', '$filter', '$ionicPopup', '$rootScope', '$scope', kontakTambahCtrl]);

   function kontakTambahCtrl($state, $http, $cordovaCamera, $ionicLoading, $filter, $ionicPopup, $rootScope, $scope) {
      /**
       * @property {Hash} vm collection og objects that belongs to this kontak tambah controller
       */
      var vm = this;

      var role_id = {};

      $scope.tambahKontak = {};
      var filePathFotoTambahKontak = null;
      $scope.picture = "img/person.png";

      $scope.tanggalMaks = new Date();
      $scope.tanggalMaks = $filter('date')($scope.tanggalMaks, 'yyyy-MM-dd');

      $scope.$on('$ionicView.enter', function() {

         // SIMPAN SEMUA DATA USER
         // DATA USER
         $rootScope.dataUser = JSON.parse(localStorage.getItem("userInfo")).user;
         // DATA BUSINESS
         $rootScope.dataBusiness = JSON.parse(localStorage.getItem("userInfo")).business;
         // Jika logo Bisnis kosong
         if (!$rootScope.dataBusiness.logo) {
            $rootScope.dataBusiness.logo = "img/logobisnis.png";
         }

         $rootScope.dataContacts = JSON.parse(localStorage.getItem("contacts"));

         role_id = $rootScope.role_id;
         console.log($rootScope.role_id);
         $scope.showBank = true;
         if (role_id == 2 || role_id == "2") {
            $scope.showBank = false;
         };
         $scope.showSales = true;
         if (role_id != 2 || role_id != "2") {
            $scope.showSales = false;
         }else if(role_id == 2){
         	$scope.dataSalesmen = $rootScope.dataContacts.salesmen;
         };

      });


      $scope.ambilFotoKontak = function() {
         $scope.data = {}

         // Popup unggah foto kontak
         var unggahFotoKontakPopup = $ionicPopup.show({
            template: 'Pilih sumber foto',
            title: 'Unggah foto kontak',
            subTitle: '',
            scope: $scope,
            buttons: [{
               text: '<i class="fa fa-camera-retro"></i><br/><b>KAMERA</b>',
               type: 'button-positive',
               onTap: function(e) {
                  return $scope.data = "1";
               }
            }, {
               text: '<i class="ion-images"></i><br/><b>GALERI</b>',
               type: 'button-positive',
               onTap: function(e) {
                  return $scope.data = "0";
               }
            }, ]
         });

         // Konfirmasi unggah foto kontak
         unggahFotoKontakPopup.then(function(res) {

            if (res) {
               document.addEventListener("deviceready", function() {
                  var options = {
                     // Parameter foto
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
                     var image = document.getElementById('fotoKontak');
                     image.src = "data:image/jpeg;base64," + imageData;

                     //Kirim semua data foto kontak
                     filePathFotoTambahKontak = imageData;
                  }, function(err) {});
               }, false);

            }

            // Konfirmasi Cancel
            else {

            }
         });
      };



      $scope.add = function() {
         // alert(role_id);

         // Ubah tanggal lahir jadi format tanggal
         var birth_date = new Date();
         birth_date = $filter('date')($scope.tambahKontak.birth_date, 'yyyy-MM-dd');

         var password = $scope.tambahKontak.password;

         if ($scope.tambahKontak.password == undefined) {
            password = $scope.tambahKontak.user_id + $rootScope.dataUser.id;
         }

         $rootScope.ionicLoading([]);

         if (filePathFotoTambahKontak == null) {
            var picture = null;
         } else {
            var picture = "data:image/jpeg;base64," + filePathFotoTambahKontak;
         }

         // Data yang dikirim ke server
         var data = {
            token: localStorage.getItem('token'),
            role_id: role_id,

            user_id: $scope.tambahKontak.user_id + '@' + $rootScope.dataUser.id,
            password: password,
            picture: picture,

            name: $scope.tambahKontak.name,
            birth_date: birth_date,
            mobile: $scope.tambahKontak.mobile,
            email: $scope.tambahKontak.email,
            gender: $scope.tambahKontak.gender,
            address: $scope.tambahKontak.address,

            bank: $scope.tambahKontak.bank,
            bank_branch: $scope.tambahKontak.bank_branch,
            bank_account_name: $scope.tambahKontak.bank_account_name,
            bank_account_no: $scope.tambahKontak.bank_account_no,
            bank_remarks: $scope.tambahKontak.bank_remarks,

            device: localStorage.getItem("deviceUUID")
         }

         console.log("Data Tambah Kontak", data);
         $rootScope.http("user/register", data,
            function(response) {
               if (response.success) {
                  $rootScope.toast('Tambah kontak berhasil');
                  localStorage.removeItem('contacts');
                  $state.go('pos.kontak');
               } else {
                  $rootScope.toast(response.message);
               }
            },
            function() {
               $rootScope.toast('Gagal terhubung server');
            },
            function() {
               $rootScope.ionicLoadingHide();
            }
         );
      };

   };

})();