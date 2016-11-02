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

    angular.module('starter').controller('produkBaruCtrl', ['$rootScope', '$scope', '$http', '$ionicPopup', '$stateParams', "$ionicLoading", '$cordovaCamera', '$state', '$cordovaImagePicker', '$ionicSlideBoxDelegate','$ionicPlatform', produkBaruCtrl]);

    function produkBaruCtrl($rootScope, $scope, $http, $ionicPopup, $stateParams, $ionicLoading, $cordovaCamera, $state, $cordovaImagePicker, $ionicSlideBoxDelegate ,$ionicPlatform) {
 
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
            if (!$rootScope.dataBusiness.logo) {
                $rootScope.dataBusiness.logo = "img/logobisnis.png";
            }
            // DATA ROLE
            $rootScope.dataRole = JSON.parse(localStorage.getItem("userInfo")).role;
            $scope.ctglist = JSON.parse(localStorage.getItem("categories"));
            $scope.param = {};
            $scope.param.tanggalPublish = new Date();
            $scope.units = JSON.parse(localStorage.getItem('units'));
            $scope.param.satuan = null;
            $scope.selectedUnits = [];
            $scope.param.productUnitPrice = [];
            $scope.images = [];
            for (var i = 0; i < 3; i++) {
                $scope.images.push({
                    id: null,
                    image: "img/img_icon.png",
                    is_change: 0
                });
            };

            var metodestok = JSON.parse(localStorage.getItem('setting')).use_warehouse;
            if (metodestok == 0) {
                $scope.disableMetode = true;
            } else {
                $scope.disableMetode = false;
            }
            $scope.param.metodestok = $scope.orderOptions[0];
            $scope.listKategori = localStorage.getItem("categories");
            $scope.listKategori = JSON.parse($scope.listKategori);
            $scope.listKategori = $scope.listKategori.data;
            for(var att in $scope.units){
                if ($scope.units[att].unit == "PCS") {
                    $scope.param.satuan = $scope.units[att];
                    $scope.selectedUnits.push($scope.units[att]);
                };
            };
        });


        $scope.orderOptions = ["DEFAULT", "FIFO", "LIFO", "AVERAGE"];
        $scope.unitChange = function() {
            $scope.selectedUnits = [];
            $scope.selectedUnits.push($scope.param.satuan);
            angular.forEach($scope.units, function(value, key) {
                if (value.id_unit == $scope.param.satuan.parent_id) {
                    $scope.selectedUnits.push(value);
                };
            })
        }

        $scope.loadProd = function() {
            var parent_id = $scope.param.kategori;
            $scope.listProd = JSON.parse(localStorage.getItem("categories"));
            angular.forEach($scope.listProd.data, function(value, key) {
                if (value.id == Number(parent_id)) {
                    $scope.listProduk = $scope.listProd.data[key];
                    $scope.key = key;
                }
            });
        };
       
        $scope.showOpen = function(index) {
            $scope.data = {}
            $scope.images_index = index;
            var unggahFotoProdukPopup = $ionicPopup.show({

                template: 'Pilih sumber foto',
                title: 'Unggah foto Produk',
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

            unggahFotoProdukPopup.then(function(res) {
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
                            $scope.images[$scope.images_index].image = "data:image/jpeg;base64," + imageData;
                            $scope.images[$scope.images_index].is_change = 1;
                            $scope.$apply();
                            //Kirim semua data foto Produk
                        }, function(err) {
                            $rootscope.toast("Gagal terhubung ke server");
                        });
                    }, false);

                } else {

                }
            });
        };

        
        
        //simpan produk
        $scope.prodSave = function() {
            $scope.tmp = {};
            var myPopup = $ionicPopup.show({
                template: '<input type="text" class="input-produk-detail" placeholder="Tambah Produk baru" ng-model="tmp.tmp_prod">',
                title: 'Konfirmasi',
                scope: $scope,
                buttons: [{
                    text: 'Batal',
                    onTap: function(e) {}
                }, {
                    text: 'Tambah',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.tmp.tmp_prod) {
                            e.preventDefault();
                        } else {
                            var dataProd = {
                                name: $scope.tmp.tmp_prod,
                                token: localStorage.getItem("token"),
                                device: localStorage.getItem("deviceUUID"),
                                parent_id: $scope.param.kategori
                            };
                            if (!dataProd.parent_id) {
                                alert("Kategori harus dipilih terlebih dahulu");
                            } else {
                                $rootScope.ionicLoading(["addProd", "SaveCtg"]);
                                $rootScope.http("category/save", dataProd,
                                    function(respon) {
                                        // Response sukses
                                        if (respon.success) {
                                            $rootScope.http("categories", data_tmp,
                                                function(feedback) {
                                                    // Response sukses
                                                    if (feedback.success) {
                                                        var tempVar = 1;
                                                        localStorage.setItem("ProdEdited", tempVar);
                                                        localStorage.setItem("categories", JSON.stringify(feedback));
                                                        $scope.listProd = feedback;
                                                        angular.forEach($scope.listProd.data, function(value, key) {
                                                            if (value.id == Number(dataProd.parent_id)) {
                                                                $scope.listProduk = $scope.listProd.data[key];
                                                                $scope.key = key;
                                                            }
                                                        });
                                                    }

                                                },
                                                function() {
                                                    $rootScope.toast("Gagal terhubung ke server.");
                                                },
                                                function() {
                                                    $rootScope.ionicLoadingHide("addProd");
                                                }
                                            )
                                        }
                                    },
                                    function() {
                                        $rootScope.toast("Gagal terhubung ke server.");
                                    },
                                    function() {
                                        $rootScope.ionicLoadingHide('SaveCtg');
                                    }
                                )
                            };
                        }
                    }
                }]
            })
        }

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

                                            $scope.loads(true);

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
                                            $scope.loads(true);
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
                                            $scope.loads(true);
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

        $scope.simpanProduk = function() {
            var data_tmp = {
                name: $scope.param.nama,
                description: $scope.param.description,
                unit: ($scope.param.satuan == null) ? null : $scope.param.satuan.unit,
                category_id: $scope.param.prod,
                parent_category_id: $scope.param.kategori,
                publish_date: $scope.param.tanggalPublish,
                stock_method: $scope.param.metodestok,
                price: null,
                discount: $scope.param.diskon,
                units: []
            };

            if (data_tmp.name == null || data_tmp.name === "") {
                $rootScope.toast("Nama Jenis produk harus di isi!");
                //ionicAlert($ionicPopup, "Nama Jenis produk harus di isi!");
                return false;
            } else if (data_tmp.category_id == null || data_tmp.category_id === "") {
                $rootScope.toast("Pilih salah satu produk!");
                //ionicAlert($ionicPopup, "Pilih salah satu produk!");
                return false;
            } else if (data_tmp.parent_category_id == null || data_tmp.parent_category_id === "") {
                $rootScope.toast("Pilih salah satu kategori!");
                //ionicAlert($ionicPopup, "Pilih salah satu kategori!");
                return false;
            } else if (data_tmp.unit == null || data_tmp.unit === "") {
                $rootScope.toast("Pilih salah satu satuan produk!");
                //ionicAlert($ionicPopup, "Pilih salah satu satuan produk!");
                return false;
            } else if ($scope.param.productUnitPrice.length <= 0) {
                $rootScope.toast("Masukkan harga jual produk tiap satuan!");
                //ionicAlert($ionicPopup, "Masukkan harga jual produk tiap satuan!");
                return false;
            } else if ($scope.param.productUnitPrice.length != $scope.selectedUnits.length) {
                $rootScope.toast("Masukkan harga jual produk tiap satuan!");
                //ionicAlert($ionicPopup, "Masukkan harga jual produk tiap satuan!");
                return false;
            } else {
                for (var i = 0; i < $scope.param.productUnitPrice.length; i++) {
                    if ($scope.param.productUnitPrice[i] == null || $scope.param.productUnitPrice[i] === "") {
                        $rootScope.toast("Masukkan harga jual produk tiap satuan!");
                        //ionicAlert($ionicPopup, "Masukkan harga jual produk tiap satuan!");
                        return false;
                    };
                };
            };

            // get parent unit
            angular.forEach($scope.units, function(value, key) {
                if (value.id_unit == $scope.param.satuan.parent_id) {
                    data_tmp.unit = value.unit;
                };
            })
            for (var i = 0; i < $scope.selectedUnits.length; i++) {
                if ($scope.param.satuan.parent_id == null || $scope.param.satuan.parent_id == "") {
                    data_tmp.price = $scope.param.productUnitPrice[i];
                } else if ($scope.selectedUnits[i].id_unit == $scope.param.satuan.parent_id) {
                    data_tmp.price = $scope.param.productUnitPrice[i];
                };

                data_tmp.units.push({
                    "unit_id": $scope.selectedUnits[i].id_unit,
                    "price": $scope.param.productUnitPrice[i]
                });
            };
            $rootScope.ionicLoading(['product_save','product_images']);            
            $rootScope.http('product/save',data_tmp,
                function(feedback){
                    var newProduct = {};
                    if (feedback.success) {
                        // ajax simpan gambar
                        newProduct = feedback.data;
                        $rootScope.http("product/images/save/" + feedback.data.id, {
                                images: $scope.images
                            },
                            function(jsons) {
                                // Response sukses
                                if (!jsons.success) {
                                    $rootScope.toast("Gagal menyimpan foto");
                                } else {
                                    newProduct.images = jsons.data;
                                }

                                //Komfirmasi
                                var listProducts = JSON.parse(localStorage.getItem("listProduk"));
                                listProducts.push(newProduct);
                                localStorage.setItem("listProduk", JSON.stringify(listProducts));
                                $scope.data = {};
                                $rootScope.ionicLoadingHide();
                                // An elaborate, custom popup
                                var myPopup = $ionicPopup.show({
                                    title: 'Konfirmasi',
                                    template: 'Menambah produk baru lagi ?',
                                    scope: $scope,
                                    buttons: [{
                                        text: 'Ya',
                                        onTap: function(e) {                                            
                                            $scope.param.kategori = "";
                                            $scope.param.prod = "";
                                            $scope.param.nama = "";
                                            $scope.param.penyedia = "";
                                            $scope.param.satuan = "";
                                            $scope.param.description = "";
                                            $scope.param.namaProd = "";                                            
                                            $scope.orderOptions = ["DEFAULT", "FIFO", "LIFO", "AVERAGE"];
                                            $scope.param.metodestok = $scope.orderOptions[0];
                                            $scope.param.diskon = "";
                                            $scope.selectedUnits = [];
                                            $scope.images = [];
                                            for (var i = 0; i < 3; i++) {
                                                $scope.images.push({
                                                    id : null,
                                                    image : "img/img_icon.png",
                                                    is_change : 0
                                                });
                                            };
                                            var tempVar = 1;
                                            localStorage.setItem("ProdEdited", tempVar);
                                            //$scope.loads(true);
                                        }
                                    }, {
                                        text: 'Tidak',
                                        type: 'button-positive',
                                        onTap: function(e) {
                                            $state.go("pos.produk");
                                            //$scope.loads(true);
                                            var tempVar = 1;
                                            localStorage.setItem("ProdEdited", tempVar);
                                        }
                                    }]
                                });
                            }
                        ), function(){
                        }, function(){
                            $rootScope.ionicLoadingHide('product_images');
                        };
                    } else {
                        $rootScope.toast(feedback.message);
                    };
                },
                function() {
                    $rootScope.toast("Gagal terhubung ke server.");
                },function(){
                    $rootScope.ionicLoadingHide('product_save');
                }
            );
        }
        $scope.loads = function(update) {
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
                                $scope.ctglist = JSON.parse(localStorage.getItem("categories"));
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

    };

})();