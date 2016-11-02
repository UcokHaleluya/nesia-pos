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

    angular.module('starter').controller('produkBaruGudangCtrl', ['$rootScope', '$scope', '$http', '$ionicPopup', '$stateParams', "$ionicLoading", '$cordovaCamera', '$state', '$cordovaImagePicker', '$ionicPlatform', produkBaruGudangCtrl]);

    function produkBaruGudangCtrl($rootScope, $scope, $http, $ionicPopup, $stateParams, $ionicLoading, $cordovaCamera, $state, $cordovaImagePicker, $ionicPlatform) {
        /**
         * @property {Hash} vm collection og objects that belongs to this produk detail controller
         */
        var vm = this;
        var data_tmp = {
            token: localStorage.getItem("token"),
            device: localStorage.getItem("deviceUUID")
        };
        $scope.$on('$ionicView.enter', function() {
             $scope.getData();
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
        $scope.namaGUdang = $stateParams.name;
        $scope.daa = null;
        $scope.par = {};       
        $scope.getData = function(){
            $rootScope.ionicLoading(["reqData1","reqData2"]);
            $rootScope.http('products-no-warehouse/' + $stateParams.id,data_tmp,
                function(respon){
                    $scope.listProduct = respon.data;
                    $rootScope.http("/suppliers", $scope.daa,
                    function(feedback){
                        if (feedback.success) {                        
                            $scope.listSupplier = feedback.data;
                            console.log("respon suppliers", $scope.listSupplier)
                        } else {
                            $rootScope.toast(feedback.message);                    
                        };
                    },function(){
                        $rootScope.toast("Gagal terhubung ke server");
                    },function(){
                        $rootScope.ionicLoadingHide("reqData1");
                    })
                }
                ,function(){
                    $rootScope.toast(respon.message);
                }
                ,function(){
                    $rootScope.ionicLoadingHide("reqData2");
            })            
        };                 
        $scope.changeId = function(index, ids, units){
            if (!index) {
                $scope.aa = "Tidak ada kode produk";
                $scope.bb = ids;
            } else {
                $scope.aa = index;
                $scope.bb = ids;
            };
            $scope.satuan = units.units;
            console.log(units);            
        };

        $scope.saveProduct = function(){
            var parameters = {                    
                    warehouse_id : $stateParams.id,
                    items : []
                };
            if (!$scope.bb) {                
                $rootScope.toast('Pilih salah satu produk terlebih dahulu');
                return;
            } else if (!$scope.par.suplier) {               
                $rootScope.toast('Pilih salah satu supplier produk');
                return;
            } else if (!$scope.par.units) {                
                $rootScope.toast('Pilih salah satu satuan produk');
                return;
            } else if (!$scope.par.qty) {                
                $rootScope.toast('Masukkan jumlah Stok');
                return;
            } else if (!$scope.par.price) {
                $rootScope.toast('Harga barang harus di tentukan');
                return;                
            };//ending else
            var items = {
                    product_id : $scope.bb,
                    supplier_id : $scope.par.suplier,
                    unit_id : $scope.par.units,
                    qty : $scope.par.qty,
                    price : $scope.par.price
                };
                parameters.items.push(items);                
                $rootScope.ionicLoading(["Requests1"]);                
                $rootScope.http('warehouse-product/save',parameters,
                    function(feedback){
                        $rootScope.ionicLoadingHide("Requests1");
                        if (feedback.success) {
                            console.log("Respon Ware-prod/save",feedback);
                            $rootScope.ionicLoadingHide("Requests1");   
                            $ionicLoading.hide();                                                     
                            var myPopup = $ionicPopup.show({
                                 title: 'pemberitahuan',
                                template: 'Tambah produk lainnya ?',
                                scope: $scope,
                                buttons: [{
                                    text: 'Tidak',
                                    onTap: function(e) {                                        
                                        $scope.par = {};
                                        var isedited = 1;
                                        localStorage.setItem("isEdited", isedited);
                                        $state.go("pos.gudang");   
                                    }
                                }, {
                                    text: 'Ya',
                                    type: 'button-positive',
                                    onTap: function(e) {                                        
                                        $scope.par = {};                                        
                                        var isedited = 1;
                                        localStorage.setItem("isEdited", isedited);
                                        $scope.getData();
                                    }
                                }]
                            })
                        } else {                            
                            $rootScope.toast(feedback.message);
                        };
                    },
                    function(){                        
                        $rootScope.toast('Gagal terhubung ke server');
                    },
                    function(){
                        $rootScope.ionicLoadingHide("Requests1");
                    }
                );
            
        };
    };

})();