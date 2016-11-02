(function() {
   'use strict';
   /**
    * @memberof starter
    * @ngdoc controller
    * @name kontakCtrl
    * @param $ionicPopup {service} controller ionic popup
    * @param $ionicLoading {service} controller ionic loading
    * @param $http {service} controller http
    * @param $ionicSlideBoxDelegate {service} controller ionic slide box
    * @param $rootScope {service} controller root scope
    * @param $scope {service} controller scope	   
    */
   angular.module('starter').controller('kontakCtrl', ['$ionicPopup', '$ionicLoading', '$http', '$ionicSlideBoxDelegate', '$rootScope', '$scope', '$state', kontakCtrl]);

   function kontakCtrl($ionicPopup, $ionicLoading, $http, $ionicSlideBoxDelegate, $rootScope, $scope, $state) {
      /**
       * @property {Hash} vm collection og objects that belongs to this kontak controller
       */
      var vm = this;
      $rootScope.tabIndex = 0;
      $rootScope.tabName = "pelanggan";
      // Inisialisasi objek kontak
      $scope.contacts = {};

      $scope.onSlideMove = function(data) {
         $rootScope.tabIndex = data.index;
         if ($rootScope.tabIndex == 1) {
            $rootScope.tabName = "sales";
            $scope.role_id = 3;
         } else if ($rootScope.tabIndex == 2) {
            $rootScope.tabName = "penyedia";
            $scope.role_id = 4;
         } else {
            $rootScope.tabName = "pelanggan";
            $scope.role_id = 2;
         }
         console.log('slide', $scope.role_id);
      };
      $scope.tambah = function(role_id) {
         console.log('click', role_id);
         $rootScope.role_id = role_id;
         if (role_id == 4) {
            $state.go('pos.tambah-penyedia');
         } else {
            $state.go('pos.kontak-tambah');
         }
      };
      // User Info Update
      $scope.$on('$ionicView.enter', function() {
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
         $rootScope.tabIndex = 0;
         $rootScope.role_id = 2;
         $rootScope.tabName = "pelanggan";

        var contacts = localStorage.getItem("contacts");
        if (contacts || contacts != null) {
          $scope.contacts = JSON.parse(contacts);
        }else{
          // Cetak data yang dikirim ke serve
         $rootScope.ionicLoading([]);
         // Pemanggilan AJAX
         $rootScope.http('contacts', {},
            function(response) {
               if (response.success) {
                  $scope.contacts = response.data;
                  localStorage.setItem("contacts", JSON.stringify(response.data));
               } else {
                  $rootScope.toast(response.message);
               }
            },
            function() {
               $rootScope.toast('Gagal terhubung ke server');
            },
            function() {
               $rootScope.ionicLoadingHide();
            }
         );
        };
      });
   };
})();