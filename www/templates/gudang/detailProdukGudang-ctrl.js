(function() {
 
    'use strict'; 
 
    /** 
     * @memberof starter
     * @ngdoc controller 
     * @name produkDetailCtrl 
     * @param $rootScope {service} controller root scope
     * @param $scope {service} controller scope
     * @param $stateParams {service} controller state params
     */

    angular.module('starter').controller('detailProdukGudangCtrl', ['$rootScope', '$scope', '$http', '$ionicPopup', '$stateParams', "$ionicLoading", '$cordovaCamera', '$state', '$cordovaImagePicker', '$ionicPlatform', detailProdukGudangCtrl]);

    function detailProdukGudangCtrl($rootScope, $scope, $http, $ionicPopup, $stateParams, $ionicLoading, $cordovaCamera, $state, $cordovaImagePicker, $ionicPlatform) {
        /**
         * @property {Hash} vm collection og objects that belongs to this produk detail controller
         */
        var vm = this;
        var data_tmp = {
            token: localStorage.getItem("token"),
            device: localStorage.getItem("deviceUUID")
        };
        $scope.$on('$ionicView.enter', function() {
            // SIMPAN SEMUA DATA USER
            // DATA USER        
            $rootScope.dataUser = JSON.parse(localStorage.getItem("userInfo")).user;
            // DATA PROFILE
            $rootScope.dataProfile = JSON.parse(localStorage.getItem("userInfo")).profile;
            // DATA BUSINESS
            $rootScope.dataBusiness = JSON.parse(localStorage.getItem("userInfo")).business;
            // Jika logo Bisnis kosong
            if(!$rootScope.dataBusiness.logo) {
              $rootScope.dataBusiness.logo = "img/logobisnis.png";
            }
            // DATA ROLE
            $rootScope.dataRole = JSON.parse(localStorage.getItem("userInfo")).role;
            $scope.init();
            $scope.namaProduct = $stateParams.pname;
            $scope.namaGudang = $stateParams.wname;
            $scope.idProduct = $stateParams.pid;
        });
        
        $scope.init = function(){
            var prodList = localStorage.getItem("Prod-ware");
            $scope.products = [];            
            if (prodList) {
                $scope.listProducts = JSON.parse(prodList);
                for (var i = 0; i < $scope.listProducts.length; i++) {
                  if ($scope.listProducts[i].warehouse_id == $stateParams.wid) {
                    if ($scope.listProducts[i].product_id == $stateParams.pid) {
                      $scope.products.push($scope.listProducts[i]);
                    };
                  };
                };
            } else {
                $rootScope.toast("Gagal memuat produk");
                $state.go("pos.gudang");
            };                        
            console.log("listProducts", $scope.products);
            console.log("stateParams", $stateParams);
        };//init

        $scope.toRp = function(a,b,c,d,e){e=function(f){return f.split('').reverse().join('')};b=e(parseInt(a,10).toString());for(c=0,d='';c<b.length;c++){d+=b[c];if((c+1)%3===0&&c!==(b.length-1)){d+='.';}}return'Rp.\t'+e(d)+',00'}

        $scope.produtDetail = function(){
            var des = localStorage.getItem("Prod-ware");
            $scope.tmpProducts = JSON.parse(des);
            angular.forEach($scope.tmpProducts, function(value, key) {
                // console.log(value.user_id);
                if ($stateParams.id == value.id) {
                    $scope.prodDetal = $scope.tmpProducts[key];
                    $scope.key = key;
                }
            });
            console.log("passing Data",$scope.prodDetal);
            $state.go("pos.tambahStok", {data : JSON.stringify($scope.prodDetal)});
        };

    };

})();