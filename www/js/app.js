// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'tabSlideBox', 'chart.js']);

/* Global Constant for role */
var ADMIN = 'admin';
var CUSTOMER = 'customer';
var SALES = 'salesman';
var SUPPLIER = 'supplier';

// Client Filter
// Leading Zero User ID
app.filter('numberFixedLen', function() {
   return function(n, len) {
      var num = parseInt(n, 10);
      len = parseInt(len, 10);
      if (isNaN(num) || isNaN(len)) {
         return n;
      }
      num = '' + num;
      while (num.length < len) {
         num = '0' + num;
      }
      return num;
   };
});



// Running
app.run(['$ionicPlatform', '$rootScope', '$http','$cordovaDevice' , '$cordovaBarcodeScanner', '$ionicLoading', '$ionicHistory', '$state',
   function($ionicPlatform, $rootScope, $http,$cordovaDevice, $cordovaBarcodeScanner,$ionicLoading, $ionicHistory, $state) {
      $ionicPlatform.ready(function() {
         // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
         // for form inputs)
         if (window.cordova) {
            if (window.cordova.plugins) {
               if (window.cordova.plugins.Keyboard) {
                  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                  cordova.plugins.Keyboard.disableScroll(true);
               }
            };
         };



         if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
         }

         // Menentukan device uuid
         try {
            // statements
            if ($cordovaDevice.getUUID() != undefined)
               localStorage.setItem("deviceUUID", $cordovaDevice.getUUID());
            else
               localStorage.setItem("deviceUUID", "Win/Mac/Linux");
         } catch (e) {
            // statements
            localStorage.setItem("deviceUUID", "Win/Mac/Linux");
         }

         $ionicPlatform.registerBackButtonAction(function(e) {
            if ($rootScope.backButtonPressedOnceToExit) {
               ionic.Platform.exitApp();
            } else if ($ionicHistory.viewHistory().backView) {
               $ionicHistory.viewHistory().backView.go();
            } else if ($ionicHistory.viewHistory().currentView.stateId == 'tentang'){
                  // $state.go($ionicHistory.viewHistory().histories.ion8.stack[length - 1].stateId);
                  var ion = null;
               angular.forEach($ionicHistory.viewHistory().histories, function(item, key){
                  if (item.historyId != "root") {
                     ion = item;
                  }
               });

               if (ion != null) {
                  $state.go(ion.stack[0].stateId);
               }
            } else {
               if ($ionicHistory.currentStateName() == "pos.menu-utama" || 
                     $ionicHistory.currentStateName() == "app.login" || 
                     $ionicHistory.currentStateName() == "app.lupa-password" || 
                     $ionicHistory.currentStateName() == "app.bantuan" || 
                     $ionicHistory.currentStateName() == "app.daftar" || 
                     $ionicHistory.currentStateName() == "splash" || 
                     $ionicHistory.currentStateName() == "prapendaftaran" || 
                     $ionicHistory.currentStateName() == "app.reset-password" || 
                     $ionicHistory.currentStateName() == "app.terimakasih-daftar" || 
                     $ionicHistory.currentStateName() == "app.pra-setelan" || 
                     $ionicHistory.currentStateName() == "app.verifikasi") {
                  $rootScope.backButtonPressedOnceToExit = true;
                  $rootScope.toast("Tekan tombol sekali lagi untuk keluar");

                  setTimeout(function() {
                     $rootScope.backButtonPressedOnceToExit = false;
                  }, 2000);
               } else {
                  $ionicHistory.nextViewOptions({
                     disableBack: true
                  });
                  $state.go('pos.menu-utama');
               };

            }
            e.preventDefault();
            return false;
         }, 101);

        $rootScope.theme = localStorage.getItem('theme');
        if ($rootScope.theme == null){
            localStorage.setItem('theme','');
        }

         //Landscape or Potrait
           try{
            var orientation = localStorage.getItem('orientation');
            if (orientation == 'portrait') {
               screen.lockOrientation('portrait');
            }else{
               screen.lockOrientation('landscape');
            };
         }catch(e){
            console.log('screen orientation not proivde in web browser mode.');
         }

     


         //Get Version
         try{
            cordova.getAppVersion(function (version) {
               $rootScope.version = version;
            });
         } catch (e){
            $rootScope.version = "1.0.0";
         };

      });
      
      // Fungsi scan Barcode
      // feedvack : object (imageText, imageFormat)
                     
      $rootScope.first = function() {
         var ukuran = screen.width;
         var myEl = angular.element(document.querySelectorAll('ion-slide'));
         myEl.attr('style', "width: " + ukuran + "px;");
      };

      $rootScope.ionicAlert = function($ionicPopup, template, title) {
         if (title == undefined) {
            title = "Error";
         };
         var alertPopup = $ionicPopup.alert({
            title: title,
            template: template
         });

         return alertPopup;
      };
      $rootScope.serverUrl = config.server;
      $rootScope.http = function(url, data, successCallback, errorCallback, completeCallback) {
         var defaultData = {
            token: localStorage.getItem("token"),
            device: localStorage.getItem("deviceUUID"),
         };

         var requestData = $rootScope.merge(defaultData, data);

         $http({
            method: "POST",
            url: config.server + url,
            data: requestData,
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
            }
         }).then(function(response) {
            // call success callback function
            var data = response.data;
            successCallback(data);
         }, function() {
            //call error callback function
            if (errorCallback != undefined) {
               errorCallback();
            };
         }).then(function() {
            //call error callback function
            if (completeCallback != undefined) {
               completeCallback();
            };
         });
      };

      $rootScope.toast = function(text, duration) {
         var longDuration = 5000;
         var shortDuration = 3000;
         var time = shortDuration;
         if (duration != undefined) {
            time = (duration == 'long') ? longDuration : time;
         };

         $('.toast .toast-content').html(text);
         $('.toast').css('display', '');
         $('.toast').removeClass('hide').removeClass('hide-important').addClass('show');
         setTimeout(function() {
            $('.toast').removeClass('show').addClass('hide');
            setTimeout(function() {
               $('.toast').addClass('hide-important');
            }, 1000);
         }, time);

      }

      $rootScope.ionicLoading = function(multiple_check) {
         $rootScope.ionicLoading.multiple_check = {};
         for (var i = 0; i < multiple_check.length; i++) {
            $rootScope.ionicLoading.multiple_check[multiple_check[i]] = false;
         };

         $ionicLoading.show({
            // template: '<ion-spinner icon="ios"></ion-spinner>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
         });
      }
      $rootScope.warehouseStatus = 0;
      $rootScope.businesstype= 'free'
      $rootScope.checkWarehouseStatus = function(){
         var setting = localStorage.getItem("setting");
         var userInfo = localStorage.getItem("userInfo");
         if (setting) {
            setting = JSON.parse(setting);
            if (userInfo) {
               userInfo = JSON.parse(userInfo);
               if (userInfo.role.name == 'admin' || userInfo.role.id == 1) {
                  $rootScope.warehouseStatus = setting.use_warehouse;
                  $rootScope.businesstype = setting.type;
               };
            };
         }; 
      };


      $rootScope.checkWarehouseStatus();
      $rootScope.ionicLoadingHide = function(state) {
         var hide = false;
         if (state == undefined) {
            hide = true;
         } else {
            if ($rootScope.ionicLoading.multiple_check == null) {
               hide = true;
            } else {
               if ($rootScope.ionicLoading.multiple_check[state] != undefined) {
                  $rootScope.ionicLoading.multiple_check[state] = true;
               };

               angular.forEach($rootScope.ionicLoading.multiple_check, function(value, key) {
                  hide = value;
               });
            };
         };

         if (hide) {
            $ionicLoading.hide();
            $rootScope.ionicLoading.multiple_check = {};
         };
      }

      $rootScope.merge = function(obj1, obj2) {
         var temp = {};
         for (var attrname in obj1) {
            temp[attrname] = obj1[attrname];
         }
         for (var attrname in obj2) {
            temp[attrname] = obj2[attrname];
         }
         return temp;
      }      
      $rootScope.scanBarcode = function(success, errorCall){  
            try {               
               $cordovaBarcodeScanner.scan().then(function(imageData) {
               if (success != undefined) {
                 var data = {
                  imageText : imageData.text,
                  imageFormat : imageData.format
                };
                success(data);
                return;
               };          
            }, function(error) {                
                if (errorCall != undefined) {
                  errorCall(error);
                };                
            });
         } catch (e){
            console.log(e);
         };                    
      };
   }
])

// Routing
app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

   // Enabling CORS
   $httpProvider.defaults.headers.common = {};
   $httpProvider.defaults.headers.get = {};
   $httpProvider.defaults.headers.post = {};
   $httpProvider.defaults.headers.put = {};
   $httpProvider.defaults.headers.delete = {};
   $httpProvider.defaults.headers.patch = {};

   $stateProvider

   // AWAL
   // Abstract True
      .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/awal/template.html',
      controller: 'logoutCtrl'
   })

   // Router splash page
   .state('splash', {
      url: '/splash',
      templateUrl: 'templates/awal/splash.html',
      /*views: {
        'mainContent': {
          templateUrl: 'templates/awal/splash.html',
        }
      }*/
   })

   // Route login
   .state('app.login', {
      url: '/login',
      views: {
         'mainContent': {
            templateUrl: 'templates/login/login.html',
         }
      }
   })

   // Route daftar
   .state('app.daftar', {
         url: '/daftar',
         views: {
            'mainContent': {
               templateUrl: 'templates/daftar/daftar.html',
            }
         }
      })
      // Route login
      .state('app.verifikasi', {
         url: '/verifikasi',
         views: {
            'mainContent': {
               templateUrl: 'templates/login/verifikasi.html',
            }
         }
      })

   // Route terimakasih daftar
   .state('app.terimakasih-daftar', {
      url: '/terimakasih-daftar',
      views: {
         'mainContent': {
            templateUrl: 'templates/daftar/terimakasih-daftar.html',
         }
      }
   })

   // Route pra setelan
   .state('app.pra-setelan', {
      url: '/pra-setelan',
      views: {
         'mainContent': {
            templateUrl: 'templates/pra-setelan/pra-setelan.html',
         }
      }
   })

   // Route lupa password
   .state('app.lupa-password', {
      url: '/lupa-password',
      views: {
         'mainContent': {
            templateUrl: 'templates/lupa-password/lupa-password.html',
         }
      }
   })

   // Route reset password
   .state('app.reset-password', {
      url: '/reset-password',
      views: {
         'mainContent': {
            templateUrl: 'templates/lupa-password/reset-password.html',
         }
      }
   })

   // Route bantuan
   .state('app.bantuan', {
      url: '/bantuan',
      views: {
         'mainContent': {
            templateUrl: 'templates/awal/bantuan.html',
         }
      }
   })


   // POS
   // Abstract True
   .state('pos', {
      abstract: true,
      url: '/pos',
      templateUrl: 'templates/template.html',
   })

   // Route menu utama
   .state('pos.menu-utama', {
      url: '/menu-utama',
      views: {
         'mainContent': {
            templateUrl: 'templates/menu-utama/menu-utama.html',
         }
      }
   })

   // Route produk
   .state('pos.produk', {
      url: '/produk',
      views: {
         'mainContent': {
            templateUrl: 'templates/produk/produk.html',
         }
      }
   })

   // Route produk detail
   .state('pos.produk-detail', {
      url: '/produk/produk-detail/:id/:ctgId',
      views: {
         'mainContent': {
            templateUrl: 'templates/produk/produk-detail.html',
         }
      }
   })

   //route produk-baru
   .state('pos.produk-baru', {
      url: '/produk/produk-baru',
      views: {
         'mainContent': {
            templateUrl: 'templates/produk/produk-baru.html',
         }
      }
   })

   // Route produk riwayat
   .state('pos.produk-riwayat', {
      url: '/produk/produk-riwayat/:id/:nama',
      views: {
         'mainContent': {
            templateUrl: 'templates/produk/produk-riwayat.html',
         }
      }
   })

   // Route penjualan
   .state('pos.penjualan', {
      url: '/penjualan',
      views: {
         'mainContent': {
            templateUrl: 'templates/penjualan/penjualan.html',
         }
      }
   })

   // Route detail penjualan
   .state('pos.detail-penjualan', {
      url: '/detail-penjualan',
      controller: 'penjualanDetailCtrl',
      params: {
         param: null
      },
      views: {
         'mainContent': {
            templateUrl: 'templates/penjualan/detail-penjualan.html',
         }
      }
   })

   // Route pembelian
   .state('pos.pembelian', {
      url: '/pembelian',
      views: {
         'mainContent': {
            templateUrl: 'templates/pembelian/pembelian.html',
         }
      }
   })

   // Route laporan dan grafik
   .state('pos.laporan-dan-grafik', {
      url: '/laporan-dan-grafik',
      views: {
         'mainContent': {
            templateUrl: 'templates/laporan-dan-grafik/laporan-dan-grafik.html',
         }
      }
   })

   // Route kontak
   .state('pos.kontak', {
      url: '/kontak',
      views: {
         'mainContent': {
            templateUrl: 'templates/kontak/kontak.html',
         }
      }
   })

   // Route tambah kontak
   .state('pos.kontak-tambah', {
      url: '/kontak/kontak-tambah',
      views: {
         'mainContent': {
            templateUrl: 'templates/kontak/kontak-tambah.html',
         }
      }
   })

   .state('pos.tambah-penyedia', {
      url: '/kontak/tambah-penyedia',
      views: {
         'mainContent': {
            templateUrl: 'templates/kontak/tambah-penyedia.html',
         }
      }
   })

   // Route kontak pelanggan
   .state('pos.kontak-pelanggan', {
      url: '/kontak/kontak-pelanggan/:id',
      views: {
         'mainContent': {
            templateUrl: 'templates/kontak/kontak-pelanggan.html',
         }
      }
   })

   // Route kontak penyedia
   .state('pos.kontak-penyedia', {
      url: '/kontak/kontak-penyedia/:id',
      views: {
         'mainContent': {
            templateUrl: 'templates/kontak/kontak-penyedia.html',
         }
      }
   })

   // Route kontak sales
   .state('pos.kontak-sales', {
      url: '/kontak/kontak-sales/:id',
      views: {
         'mainContent': {
            templateUrl: 'templates/kontak/kontak-sales.html',
         }
      }
   })

   // pengiriman
   .state('pos.pengiriman', {
      url: '/pengiriman',
      views: {
         'mainContent': {
            templateUrl: 'templates/pengiriman/pengiriman.html',
         }
      }
   })

   // Route gudang
   .state('pos.gudang', {
      url: '/gudang',
      views: {
         'mainContent': {
            templateUrl: 'templates/gudang/gudang.html',
         }
      }
   })

   .state('pos.produkBaruGudang', {
      url: '/produkBaruGudang/:id/:name',
      views: {
         'mainContent': {
            templateUrl: 'templates/gudang/produkBaruGudang.html',
         }
      }
   })

   .state('pos.tambahStok', {
      url: '/tambahStok?data',
      views: {
         'mainContent': {
            templateUrl: 'templates/gudang/tambahStok.html',
         }
      }
   })

   // Route perpindahan gudang
   .state('pos.perpindahan-gudang', {
      url: '/perpindahan-gudang/:id',
      views: {
         'mainContent': {
            templateUrl: 'templates/gudang/perpindahan-gudang.html',
         }
      }
   })

   .state('pos.detailProdukGudang', {
      url: '/detailProdukGudang/:pid/:wid/:wname/:pname/:id',
      views: {
         'mainContent': {
            templateUrl: 'templates/gudang/detailProdukGudang.html',
         }
      }
   })

   // Route riwayat gudang
   .state('pos.riwayat-gudang', {
      url: '/riwayat-gudang/:id',
      views: {
         'mainContent': {
            templateUrl: 'templates/gudang/riwayat-gudang.html',
         }
      }
   })

   .state('pos.riwayat-transfer', {
      url: '/riwayat-transfer/:id',
      views: {
         'mainContent': {
            templateUrl: 'templates/gudang/riwayat-transfer.html',
         }
      }
   })

   // Route pengeluaran
   .state('pos.pengeluaran', {
      url: '/pengeluaran',
      views: {
         'mainContent': {
            templateUrl: 'templates/pengeluaran/pengeluaran.html',
         }
      }
   })

   // Route list pengeluaran
   .state('pos.list-pengeluaran', {
      url: '/list-pengeluaran',
      views: {
         'mainContent': {
            templateUrl: 'templates/pengeluaran/list-pengeluaran.html',
         }
      }
   })

   // Route setelan
   .state('pos.pengaturan', {
      url: '/pengaturan',
      views: {
         'mainContent': {
            templateUrl: 'templates/pengaturan/pengaturan.html',
         }
      }
   })

   // Route bantuan
   .state('pos.bantuan', {
      url: '/bantuan',
      views: {
         'mainContent': {
            templateUrl: 'templates/setelan/bantuan.html',
         }
      }
   })

   // Route returpenjualan
   .state('pos.retur-penjualan', {
      url: '/retur-penjualan',
      views: {
         'mainContent': {
            templateUrl: 'templates/penjualan/retur-penjualan.html',
         }
      }
   })

   // Route riwayatpenjualan
   .state('pos.riwayat-penjualan', {
      url: '/riwayat-penjualan',
      views: {
         'mainContent': {
            templateUrl: 'templates/penjualan/riwayat-penjualan.html',
         }
      }
   })

   // Route riwayatretur
   .state('pos.riwayat-retur', {
      url: '/riwayat-retur',
      views: {
         'mainContent': {
            templateUrl: 'templates/penjualan/riwayat-retur.html',
         }
      }
   })

   //Route TentangAplikasi
   .state('tentang', {
      url: '/tentang',
      templateUrl: 'templates/tentang/tentang.html',
      // views: {
      //   'mainContent': {
      //     templateUrl: 'templates/tentang/tentang.html',
      //   }
      // }
   })

   .state('pos.detail-retur', {
      url: '/detail-retur',
      controller: 'detailReturCtrl',
      params: {
         param: null
      },
      views: {
         'mainContent': {
            templateUrl: 'templates/penjualan/detail-retur.html',
         }
      }
   })

   // Route pra-pendaftaran
   .state('prapendaftaran', {
      url: '/prapendaftaran',
      // controller :'praPendaftaranCtrl'
      templateUrl: 'templates/pra-pendaftaran/pra-pendaftaran.html',
   });

   // if none of the above states are matched, use this as the fallback
   // Jika tidak ditemukan route diatas, maka akan redirect ke login
   $urlRouterProvider.otherwise('/splash');
});