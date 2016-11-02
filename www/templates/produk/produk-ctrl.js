    (function() {

        'use strict';

        angular.module('starter').controller('produkCtrl', ['$rootScope', '$scope', '$cordovaBarcodeScanner', '$state', '$http', '$ionicPopup', '$ionicLoading', '$stateParams', '$ionicSlideBoxDelegate', produkCtrl]);

        /**
         * @memberof starter
         * @ngdoc controller
         * @name pembelianCtrl
         * @param $rootScope {service} controller root scope
         * @param $scope {service} controller scope
         */

        function produkCtrl($rootScope, $scope, $cordovaBarcodeScanner, $state, $http, $ionicPopup, $ionicLoading, $stateParams, $ionicSlideBoxDelegate) {
            /**
             * @property {Hash} vm collection og objects that belongs to this pembelian controller
             */
            var vm = this;
            var data_tmp = {};
            var data = {};
            $scope.data = {};
 
            /**
             * Menjalankan parameter ketika ui tampil
             * @memberof pembelianCtrl
             * @function $scope.$on
             * @$ionicView.enter {Service} memasuki ui
             */
            // User Info Update
            $scope.$on('$ionicView.enter', function() {
                $scope.$apply();
                // SIMPAN SEMUA DATA USER
                // DATA USER
                $rootScope.dataUser = JSON.parse(localStorage.getItem("userInfo")).user;

                // DATA PROFILE
                $rootScope.dataProfile = JSON.parse(localStorage.getItem("userInfo")).profile;

                // DATA BUSINESS
                $rootScope.dataBusiness = JSON.parse(localStorage.getItem("userInfo")).business;

                //DATA KONTAK

                // Jika logo Bisnis kosong
                if (!$rootScope.dataBusiness.logo) {
                    $rootScope.dataBusiness.logo = "img/logobisnis.png";
                }

                data_tmp = {
                    user_id: localStorage.getItem("id")
                };
                // 
                // DATA ROLE
                $rootScope.dataRole = JSON.parse(localStorage.getItem("userInfo")).role;
                // var tmpProduct = localStorage.getItem("listProduk");
                // if (tmpProduct || tmpProduct != null) {
                //     tmpProduct = JSON.parse(tmpProduct);
                // };
                // $scope.listProduk = tmpProduct
                // var tmpCtg = localStorage.getItem("categories");
                // if (tmpCtg || tmpCtg != null) {
                //     tmpCtg = JSON.parse(tmpCtg);
                // };
                // $scope.listKategori = tmpCtg;    
                var isEdited = localStorage.getItem("ProdEdited");
                if (isEdited == "1") {
                    $scope.loads(true);
                } else {
                    $rootScope.loads(false);
                };
            });

            $rootScope.loads = function(update) {
                if (update == undefined) {
                    update = false;
                };
                $rootScope.ionicLoading(['categories', 'product']);
                $scope.listKategori = localStorage.getItem("categories");

                // $rootScope.ionicLoading(['categories', 'product']);
                if ($scope.listKategori == null || update) {

                    //$rootScope.ionicLoading('categories');
                    $rootScope.http('categories', {
                            user_id: localStorage.getItem("id")
                        },
                        function(feedback) {
                            // Response sukses
                            if (feedback.success) {
                                $scope.listKategori = feedback.data;
                                localStorage.setItem("categories", JSON.stringify(feedback));
                                var tempVar = 0;
                                localStorage.setItem("ProdEdited", tempVar);
                                $ionicLoading.hide();
                                $ionicSlideBoxDelegate.update()
                            }
                        },
                        function() {},
                        function() {
                            $rootScope.ionicLoadingHide('categories');
                        }
                    );
                } else {

                    $scope.listKategori = JSON.parse($scope.listKategori).data;
                    $rootScope.ionicLoadingHide('categories');
                }
                $scope.listProdukData = false;
                $scope.listProduk = localStorage.getItem("listProduk");
                if ($scope.listProduk == null || update) {

                    //$rootScope.ionicLoading('product');
                    $rootScope.http('products', {
                            user_id: localStorage.getItem("id")
                        },
                        function(response) {
                            // Response sukses
                            if (response.success) {
                                $scope.listProduk = response.data.products;
                                /*localStorage.setItem("POS-prodlist", JSON.stringify(produk));*/
                                localStorage.setItem("listProduk", JSON.stringify(response.data.products));
                                localStorage.setItem("units", JSON.stringify(response.data.unit));
                                var tempVar = 0;
                                localStorage.setItem("ProdEdited", tempVar);
                            }
                        },
                        function() {},
                        function() {
                            $rootScope.ionicLoadingHide('product');
                        }
                    );
                } else {

                    $scope.listProduk = JSON.parse($scope.listProduk);
                    $rootScope.ionicLoadingHide('product');
                };
            };
            //$rootScope.loads();

            $scope.lists = function(){

                var pagesShown = 1;
                var pageSize = 10;
            };
            $scope.editKategori = function() {
                $scope.data = {};
                var myPopup = $ionicPopup.show({
                    template: '<div style=" font-size: smaller;">' +
                        '<div class="row">' +
                        '<div class="col">' +
                        '<select ng-model="data.tmp_ktg" class="input-select" style="color:black; padding: 0px;">' +
                        '<option disabled value="">Pilih Kategori</option>' +
                        '<div ng-controller="produkCtrl">' +
                        '<option  ng-model="data.ktg" ng-repeat="x in listKategori" value="{{x.id}}">{{x.name}}</option>' +
                        '</select>' +
                        '</div>' +
                        '<div class="col-20">' +
                        '<button class="btn btn-md btn-transparant icon-delete-produk" ng-click="hpsKtg()">' +
                        '<i style="margin-left:20px; font-size:25px;" class="fa fa-trash"></i>' +
                        '</button>' +

                        '</div>' +
                        '</div>' +
                        '<div class="row">' +
                        '<div class="col">' +
                        '<label style="margin-top:0px;">Ubah nama kategori</label>' +
                        '<input style="font-size: smaller; type="text" ng-model="data.tmp_nama" class="input-select" placeholder="Masukkan nama baru"/>' +
                        '</div>' +
                        '</div>' +
                        '</div>',
                    title: 'Sunting Kategori',
                    subTitle: 'Silahkan memilih Kategori',
                    scope: $scope,
                    buttons: [{
                        text: 'Batal'
                    }, {
                        text: '<b>Simpan</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.data.tmp_nama) {
                                //don't allow the user to close 
                                e.preventDefault();
                            } else if (!$scope.data.tmp_ktg) {
                                //jika kategori tidak terpilih
                                e.preventDefault();
                            } else {
                                $rootScope.ionicLoading('ctg');
                                var tmpData = {
                                    user_id: localStorage.getItem("id"),
                                    name: $scope.data.tmp_nama.toUpperCase(),
                                    id: $scope.data.tmp_ktg
                                };

                                $rootScope.http("category/save/" + $scope.data.tmp_ktg, tmpData,
                                    function(response) {
                                        if (response.success) {
                                            $rootScope.toast('Kategori berhasil disimpan');
                                            $rootScope.loads(true);
                                        } else {
                                            $rootScope.toast('Gagal mengirim');
                                        };
                                    },
                                    function() {
                                        $rootScope.toast('Gagal mengirim');
                                    },
                                    function() {
                                        $rootScope.ionicLoadingHide('ctg');
                                    }
                                );
                            }
                        }
                    }]
                });
                $scope.hpsKtg = function() {

                    if (!$scope.data.tmp_ktg || $scope.data.tmp_ktg == null || $scope.data.tmp_ktg < 1) {
                        $rootScope.toast('kategori harus dipilih');
                            } else {
                                $rootScope.ionicLoading('ctg');
                                var tsData = {
                                    user_id: localStorage.getItem("id"),
                                    active: 0,
                                    id: $scope.data.tmp_ktg
                                };

                                $rootScope.http("category/save/" + $scope.data.tmp_ktg, tsData,
                                    function(response) {
                                        if (response.success) {
                                            $rootScope.toast('Kategori berhasil dihapus');
                                            $rootScope.loads(true);
                                        } else {
                                            $rootScope.toast(response.message);
                                        };
                                    },
                                    function() {
                                        $rootScope.toast('Gagal terhubung ke server');
                                    },
                                    function() {
                                        $rootScope.ionicLoadingHide('ctg');
                                    }
                                );
                            }

                    };
            };
            $scope.scanBarcode = function() {
                var prd = localStorage.getItem("listProduk");
                var result = $rootScope.scanBarcode(
                    function(data) {
                        prd = JSON.parse(prd);
                        for (var attr in prd) {
                            if (prd.id == data.imageText) {
                                $state.go("pos.produk-detail", {
                                    id: data.imageText
                                });
                            };
                        };
                    },
                    function() {
                        $rootScope.toast("Gagal memindai gambar");
                    }
                );
            };
            $scope.tambahKategori = function() {
                $scope.data = {};
                var myPopup = $ionicPopup.show({
                    template: '<label style="margin-top:0px; margin-bottom: 10px;">Nama Kategori Baru</label>' +
                        '<input type="text" class="input-select" placeholder="Tambah kategori baru" ng-model="data.nama">',
                    title: 'Tambah Kategori baru',
                    scope: $scope,
                    buttons: [{
                        text: 'Batal',
                        onTap: function(e) {}
                    }, {
                        text: 'Tambah',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.data.nama) {
                                e.preventDefault();
                            } else {
                                $rootScope.ionicLoading('ctg');
                                var data = {
                                    name: $scope.data.nama.toUpperCase()
                                };

                                $rootScope.http("category/save", data,
                                    function(response) {
                                        if (response.success) {
                                            $rootScope.toast('Kategori berhasil disimpan');
                                            $rootScope.loads(true);
                                        } else {
                                            $rootScope.toast(response.message);
                                        };
                                    },
                                    function() {
                                        $rootScope.toast('Gagal terhubung ke server');
                                    },
                                    function() {
                                        $rootScope.ionicLoadingHide('ctg');
                                    }
                                );
                            }
                        }
                    }]
                })
            };
        };
    })();