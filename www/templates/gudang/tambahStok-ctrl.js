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

    angular.module('starter').controller('tambahStokCtrl', ['$rootScope', '$scope', '$http', '$ionicHistory','$ionicPopup', '$stateParams', "$ionicLoading", '$cordovaCamera', '$state', '$cordovaImagePicker', '$ionicPlatform', tambahStokCtrl]);

    function tambahStokCtrl($rootScope, $scope, $http, $ionicHistory, $ionicPopup, $stateParams, $ionicLoading, $cordovaCamera, $state, $cordovaImagePicker, $ionicPlatform) {
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
          });        
        console.log("Passing data", $stateParams);
        var a = JSON.stringify($stateParams.data);
        var b = a.substring(1, a.length-1);
        var finalData = b.replace(/\\/g, "");
        $scope.productDetail = JSON.parse(finalData);
        var temps = localStorage.getItem("suppliers");
        $scope.supplier = JSON.parse(temps);
        console.log("supplier", $scope.supplier);
        console.log("productDetail", $scope.productDetail);
        $scope.par = {suplier : $scope.productDetail.supplier_name};
        // for (var i = $scope.supplier.length - 1; i >= 0; i--) {
        //     Things[i]
        // };
        $scope.getInput = {};
        $scope.addStock = function(){                        
            $scope.data = {
                warehouse_id : $scope.productDetail.warehouse_id,
                items : []
            };           
            if (!$scope.getInput.supplier) {               
                $rootScope.toast('Pilih salah satu supplier produk');
            } else if (!$scope.getInput.units) {                
                $rootScope.toast('Pilih salah satu satuan produk');
            } else if (!$scope.getInput.qty) {                
                $rootScope.toast('Masukkan jumlah Stok');
            } else if (!$scope.getInput.price) {
                $rootScope.toast('Harga barang harus di tentukan');
            } else {
                var items = {
                    product_id : $scope.productDetail.product_id,
                    supplier_id : $scope.getInput.supplier,
                    unit_id : $scope.getInput.units,
                    qty : $scope.getInput.qty,
                    price : $scope.getInput.price
                };
            };
            $scope.data.items.push(items);
            console.log("Inputan", $scope.data);
            $rootScope.ionicLoading("addStock");            
            $rootScope.http("/warehouse-product/save", $scope.data,
             function(res){
                if (res.success) {                        
                    $rootScope.toast('Produk berhasil disimpan');
                    var isedited = 1;
                    localStorage.setItem("isEdited", isedited);
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go("pos.gudang");                    
                    $ionicLoading.hide("addStock");
                } else {
                    $ionicLoading.hide("addStock");
                     $rootScope.toast(res.message);
                    // $rootScope.ionicAlert($ionicPopup, res.message, "Pemberitahuan");                    
                };
            },function(){                
                 $rootScope.toast( "Gagal terhubung ke server");
            },function(){
                $rootScope.ionicLoadingHide("addStock");
            });

        };

    };

})();