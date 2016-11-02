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
   angular.module('starter').controller('produkDetailCtrl', ['$rootScope', '$scope', '$http', '$ionicPopup', '$stateParams', '$state', "$ionicLoading", '$cordovaCamera', '$cordovaImagePicker', '$cordovaFileTransfer', '$timeout', produkDetailCtrl]);

   function produkDetailCtrl($rootScope, $scope, $http, $ionicPopup, $stateParams, $state, $ionicLoading, $cordovaCamera, $cordovaImagePicker, $cordovaFileTransfer, $timeout) {
      /**
       * @property {Hash} vm collection og objects that belongs to this produk detail controller
       */
      var vm = this;
      /**
       * Menjalankan parameter ketika ui tampil
       * @memberof produkDetailCtrl
       * @function $scope.$on 
       * @$ionicView.enter {Service} memasuki ui
       */
      // User Info Update
      $scope.$on('$ionicView.enter', function() {
         // SIMPAN SEMUA DATA USER 
         // DATA USER
         $scope.produklist = {};
         $rootScope.dataUser = JSON.parse(localStorage.getItem("userInfo")).user;
         // DATA PROFILE
         $rootScope.dataProfile = JSON.parse(localStorage.getItem("userInfo")).profile;
         // DATA BUSINESS
         $rootScope.dataBusiness = JSON.parse(localStorage.getItem("userInfo")).business;
         // Jika logo Bisnis kosong
         if (!$rootScope.dataBusiness.logo) {
            $scope.id = $stateParams.id;
            $rootScope.dataBusiness.logo = "img/logobisnis.png";
         }
         //$scope pembantu buat list jenis
         $scope.firstShow = true;
         // ambil ID produk
         $scope.id = $stateParams;
         // ambil data produk dari localstorage
         $scope.prodlist = JSON.parse(localStorage.getItem("listProduk"));
         angular.forEach($scope.prodlist, function(value, key) {
            // 
            if (value.id == Number($scope.id.id)) {
               $scope.produklist = $scope.prodlist[key];
               var dataBarang = $scope.produklist;
               $scope.key = key;
            }
         });
         //ambil data kategori dari localstorage
         $scope.ktgList = [];
         $scope.parent_ctg = $scope.produklist.parent_category_id;
         $scope.ctglist = JSON.parse(localStorage.getItem("categories")).data;
         $scope.param = {};
         $scope.units = JSON.parse(localStorage.getItem('units'));
         $scope.selectedUnits = [];
         $scope.param.productUnitPrice = [];
         $scope.selectedUnits = [];
         $scope.selectedUnits = $scope.produklist.units;
         $scope.listProduk = {};
         angular.forEach($scope.ctglist, function(value, key) {
            $scope.ktgList.push(value);
            if (value.id == Number($scope.parent_ctg)) {
               $scope.key = key;
               $scope.subcategories = value.subcategories;
               $scope.headImage = value.images;
            }
         });
         //ambil data jenis berdasarkan katgori yang terpilih
         //set methode stock
         $scope.methodStockOption = [{
            value: "FIFO",
            id: 1
         }, {
            value: "LIFO",
            id: 2
         }, {
            value: "AVERAGE",
            id: 3
         }, {
            value: "DEFAULT",
            id: 4
         }];
         $scope.param.metodeStok = $scope.produklist.stock_method;
         //set unit
         $scope.units = JSON.parse(localStorage.getItem('units'));
         var satuan = {};
         if ($scope.produklist.units.length == 1) {
            satuan = $scope.produklist.units[0];
         } else if ($scope.produklist.units.length > 1) {
            for (var i = 0; i < $scope.produklist.units.length; i++) {
               if ($scope.produklist.units[i].parent_id != "" && $scope.produklist.units[i].parent_id != null) {
                  satuan = $scope.produklist.units[i];
                  break;
               };
            };
         };
         //set selected unit
         angular.forEach($scope.units, function(value, key) {
            if (value.id_unit == satuan.unit_id) {
               satuan = value;
            };
         })
         $scope.param.satuan = satuan;
         //set unit price
         for (var i = 0; i < $scope.selectedUnits.length; i++) {
            $scope.param.productUnitPrice[i] = parseInt($scope.selectedUnits[i].price);
         };

         $scope.param.kategori = $scope.produklist.parent_category_id;
         $scope.param.jenis = $scope.produklist.category_id;
         if (!$scope.param.kategori) {
            $scope.ktgDisable = true;
         } else {
            $scope.ktgDisable = false;
         };
         //get product image
         $scope.images = [];
         $scope.images_index = 0;
         $scope.gbr = {};
         for (var i = 0; i < 3; i++) {
            if ($scope.produklist.images[i] != null) {
               $scope.images.push({
                  id: $scope.produklist.images[i].id,
                  image: $scope.produklist.images[i].image,
                  is_change: 0
               });
            } else {
               $scope.images.push({
                  id: null,
                  image: "img/img_icon.png",
                  is_change: 0
               });
            }
         };         
      }); //onview 

      //    $scope.downloadImage = function() { 
      //      var url = "http://ngcordova.com/img/ngcordova-logo.png",
      //          // filename = url.split("/").pop  targetPath = cordova.file.externalRootDirectory + filename,
      //          options = {},
      //          trustHosts = true;

      //      $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(
      //       function(response) {
      //        $rootScope.toast('Download QR code berhasil')
      //         refreshMedia.refresh(targetPath);
      //       },
      //       function() {
      //         alert('Error: ' + JSON.stringify(err));
      //       },
      //       function() {
      //         $rootScope.toast('Gagal terhubung ke server')
      //       }
      //     );
      // };     
      var changed = false;
      $scope.unitChange = function() {
         $scope.selectedUnits = [];
         $scope.selectedUnits.push($scope.param.satuan);
         angular.forEach($scope.units, function(value, key) {
            if (value.id_unit == $scope.param.satuan.parent_id) {
               $scope.selectedUnits.push(value);
            };
         })
         changed = true;
         for (var i = 0; i < $scope.selectedUnits.length; i++) {
            for(var atri in $scope.produklist.units){
               var isSame = true;
               if ($scope.selectedUnits[i].id_unit == $scope.produklist.units[atri].id_unit) {
                  $scope.selectedUnits[i].price = $scope.produklist.units[atri].price;
                  isSame = false;
               };
               if (isSame) {
                  $scope.selectedUnits[i].price = 0;
               };
            };
            $scope.param.productUnitPrice[i] = parseInt($scope.selectedUnits[i].price);
         };
         
         
         
         
      }
      $scope.stockMethodChanged = function() {
         changed = true;
      };
      

      $scope.pilihProduk = function() {
         if (!$scope.param.kategori) {
            $scope.ktgDisable = true;
         } else {
            $scope.ktgDisable = false;
         };
         $scope.firstShow = false;
         $scope.parent_ctg = $scope.param.kategori;
         angular.forEach($scope.ctglist, function(value, key) {
            if (value.id == Number($scope.parent_ctg)) {
               $scope.key = key;
               $scope.subcategories = value.subcategories;
            }
         });
      };
      $scope.downloadQRcode = function(serverUrl,id,code,name,price) {         
         //{{serverUrl}}/products/qrcode/{{id.id}}/{{produklist.code}}/{{produklist.name}}/{{param.productUnitPrice[0]}}/6
         var url = serverUrl + 'products/qrcode/'; 
         url+= id;
         url+= '/';
         url+= code; 
         url+= '/'; 
         url+= name; 
         url+= '/'; 
         url+= price;
         url+= '/6' 
         var filename = "QR code : " + $scope.produklist.name + ".png";
         
         var targetPath = cordova.file.externalRootDirectory + filename;
         var trustHosts = true
         var options = {};
         $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
            .then(function(result) {
               $rootScope.toast("Gambar berhasil di simpan ke galeri (Internal Memory)");
            }, function(error) {
               // Error
               $rootScope.toast(JSON.stringify(error));
            }, function(progress) {
               $timeout(function() {
                  $scope.downloadProgress = (progress.loaded / progress.total) * 100;
               })
            });
      }
      $scope.reqData = function() {
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
               }
            },
            function() {},
            function() {
               $rootScope.ionicLoadingHide('product');
            }
         );
      };
      $scope.showOpen = function(index) {
         if ($scope.disabled) {
            return;
         };
         $scope.images_index = index;
         var options = {
            maximumImagesCount: 1,
            width: 0,
            height: 0,
            quality: 50
         };
         //func untuk convert base64
         function convertImgToDataURLviaCanvas(url, callback, outputFormat) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function() {
               var canvas = document.createElement('CANVAS');
               var ctx = canvas.getContext('2d');
               var dataURL;
               canvas.height = this.height;
               canvas.width = this.width;
               ctx.drawImage(this, 0, 0);
               dataURL = canvas.toDataURL(outputFormat);
               callback(dataURL);
               canvas = null;
            };
            img.src = url;
         }
         $cordovaImagePicker.getPictures(options)
            .then(function(results) {
               for (var i = 0; i < results.length; i++) {
                  convertImgToDataURLviaCanvas(results[i], function(base64) {
                     $scope.images[$scope.images_index].image = base64;
                     $scope.images[$scope.images_index].is_change = 1;
                     $scope.$apply();
                  });
               }
            }, function(error) {
               $rootScope.toast("Gagal memuat gambar.");
            });
      };
      $scope.clickUpload = function() {
         angular.element('#upload').trigger('click');
      };
      //function untuk memperbaharui data
      $scope.callData = function() {
         var data_tmp = {
            user_id: localStorage.getItem("id")
         };
         $rootScope.http("products", data_tmp,
            function(response) {
               
               if (response.success) {
                  localStorage.removeItem("POS-prodlist");
                  localStorage.removeItem("listProduk");
                  $scope.listProduk = produk.data;
                  localStorage.setItem("POS-prodlist", JSON.stringify(produk));
                  localStorage.setItem("listProduk", JSON.stringify(produk.data));
               } else {
                  $rootScope.toast(response.message);
               }
            },
            function() {
               $rootScope.toast('Gagal terhubung ke server')
            },
            function() {
               $ionicLoading.hide();
            }
         );
      };
      $scope.deleteproduk = function() {
         var tsData = {
            active: false
         }
         var myPopup = $ionicPopup.show({
            template: 'Apakah anda yakin ingin menghapus Produk ini ?',
            title: 'Konfirmasi',
            scope: $scope,
            buttons: [{
               text: 'Batal',
               onTap: function(e) {}
            }, {
               text: 'Hapus',
               type: 'button-positive',
               onTap: function(e) {
                  $rootScope.ionicLoading('delProd');
                  $rootScope.http("product/activate/" + $stateParams.id, tsData,
                     function(response) {
                        if (response.success) {
                           // localStorage.setItem("listProduk", JSON.stringify(produk.data))
                           var tempVar = 1;
                           localStorage.setItem("ProdEdited", tempVar);
                           $rootScope.toast('Produk berhasil dihapus');
                           $scope.reqData();
                           var tempVar = 1;
                           localStorage.setItem("ProdEdited", tempVar);

                           var isedited = 1;
                           localStorage.setItem("isEdited", isedited);  

                           $state.go('pos.produk');
                        } else {
                           $rootScope.toast(response.message);
                        };
                     },
                     function() {
                        $rootScope.toast('Gagal terhubung server');
                     },
                     function() {
                        $rootScope.ionicLoadingHide("delProd");
                     }
                  );
               }
            }]
         })
      };
      $scope.updateJenis = function() {
         var dataJenis = {
            token: localStorage.getItem("token"),
            device: localStorage.getItem("deviceUUID"),
            price: null,
            discount: $scope.param.diskon,
            units: []
         };
         if ($scope.param.nama) {
            dataJenis.name = $scope.param.nama;
         };
         if ($scope.param.description) {
            dataJenis.description = $scope.param.description;
         };
         if ($scope.param.kategori) {
            dataJenis.parent_category_id = $scope.param.kategori;
         };
         if ($scope.param.jenis) {
            dataJenis.category_id = $scope.param.jenis;
         };
         if ($scope.param.metodeStok) {
            dataJenis.stock_method = $scope.param.metodeStok;
         };
         if ($scope.param.satuan) {
            dataJenis.unit = $scope.param.satuan;
         };

         if (dataJenis.unit.id_unit == null) {
            $rootScope.toast("Pilih salah satu satuan produk!");
            return false;
         } else if ($scope.param.productUnitPrice.length <= 0) {
            $rootScope.toast("Masukkan harga jual produk tiap satuan!");
            return false;
         } else if ($scope.param.productUnitPrice.length != $scope.selectedUnits.length) {
            $rootScope.toast("Masukkan harga jual produk tiap satuan!");
            return false;
         } else {
            for (var i = 0; i < $scope.param.productUnitPrice.length; i++) {
               if ($scope.param.productUnitPrice[i] == null || $scope.param.productUnitPrice[i] === "") {
                  $rootScope.toast("Masukkan harga jual produk tiap satuan!");
                  return false;
               };
            };
         };
         // get parent unit
         if ($scope.param.satuan.parent_id == null) {
            dataJenis.unit = $scope.param.satuan.unit;
         } else {
            angular.forEach($scope.units, function(value, key) {
               if (value.id_unit == $scope.param.satuan.parent_id) {
                  dataJenis.unit = value.unit;
               };
            });
         };
         for (var i = 0; i < $scope.selectedUnits.length; i++) {
            if ($scope.param.satuan.parent_id == null || $scope.param.satuan.parent_id == "") {
               dataJenis.price = $scope.param.productUnitPrice[i];
            } else if ($scope.selectedUnits[i].id_unit == $scope.param.satuan.parent_id) {
               dataJenis.price = $scope.param.productUnitPrice[i];
            };
            dataJenis.units.push({
               "unit_id": $scope.selectedUnits[i].id_unit,
               "price": $scope.param.productUnitPrice[i]
            });
         };
         $rootScope.ionicLoading(['product_save', 'product_images']);
         $rootScope.http("product/save/" + $stateParams.id, dataJenis,
            function(response) {
               // Response sukses
               var data = response.data;
               if (response.success) {
                  var product = response.data;
                  $rootScope.http("product/images/save/" + product.id, {
                        images: $scope.images
                     },
                     function(resp) {
                        if (resp.success) {
                           if (resp.data) {
                              product.images = resp.data;
                              var listProducts = JSON.parse(localStorage.getItem("listProduk"));
                              for (var i = 0; i < listProducts.length; i++) {
                                 if (listProducts[i].id === product.id) {
                                    listProducts[i] = product;
                                    break;
                                 };
                              };
                           };
                           var tempVar = 1;
                           localStorage.setItem("ProdEdited", tempVar);
                           localStorage.setItem("listProduk", JSON.stringify(listProducts));
                           var isedited = 1;
                           localStorage.setItem("isEdited", isedited);
                           $state.go("pos.produk");
                        } else {
                           $rootScope.toast(resp.message);
                        }
                     },
                     function() {
                        $rootScope.toast('Gagal memperbaharui gambar');
                     },
                     function() {
                        $rootScope.ionicLoadingHide('product_images');
                     });
               } else {
                  $rootScope.toast(response.message);
                  $rootScope.ionicLoadingHide('product_images');
               }
            },
            function() {
               $rootScope.toast('Gagal terhubung ke server');
            },
            function() {
               $rootScope.ionicLoadingHide('product_save');
            });
      };
      //fungsi Menarik data dari server
      var tmp_var = {
         user_id: localStorage.getItem("id")
      };
      $scope.loads = function() {
         $rootScope.ionicLoading([]);
         $rootScope.http("categories", tmp_var,
            function(feedback) {
               
               if (feedback.success) {
                  $scope.listKategori = feedback.data;
                  //$scope.jnsId = feedback.data.user_id + feedback.data.parent_category_id + feedback.data.category_id + feedback.data.id;
                  localStorage.setItem("categories", JSON.stringify(feedback));
                  $ionicLoading.hide();
                  $scope.ctglist = JSON.parse(localStorage.getItem("categories")).data;
                  angular.forEach($scope.ctglist, function(value, key) {
                     if (value.id == Number($scope.parent_ctg)) {
                        $scope.key = key;
                        $scope.subcategories = value.subcategories;
                        $scope.headImage = value.images;
                     }
                  });
               };
            }
         );
         $rootScope.ionicLoading([]);
         $rootScope.http("products", tmp_var,
            function(produk) {
               
               if (produk.success) {
                  $scope.listProduk = produk.data.products;
                  localStorage.setItem("POS-prodlist", JSON.stringify(produk));
                  localStorage.setItem("listProduk", JSON.stringify(produk.data.products));
                  $ionicLoading.hide();
               };
            }
         );
      };
      // fungsi untuk mengubah kategori
      $scope.ediKategori = function() {
         if (!$scope.param.kategori) {
            $rootScope.toast("Pilih kategori terlebih dahulu");
         } else {
            $scope.id = $scope.param.kategori;
            // ambil data produk dari localstorage
            $scope.Katlist = JSON.parse(localStorage.getItem("categories"));
            angular.forEach($scope.Katlist.data, function(value, key) {
               // 
               if (value.id == Number($scope.id)) {
                  $scope.Katelist = $scope.Katlist.data[key];
                  $scope.key = key;
               }
            });
            //munculkan popup
            $scope.data = {};
            var myPopup = $ionicPopup.show({
               template: '<div style=" font-size: smaller;">' +
                  '<div class="row">' +
                  '<div class="col">' +
                  '<select class="input-select" ng-model="data.tmp_ktg" style="color:black; padding: 0px;">' +
                  '<option disabled value="">Pilih Produk</option>' +
                  '<div ng-controller="produkDetailCtrl">' +
                  '<option  ng-model="data.ktg" ng-repeat="x in Katelist.subcategories" value="{{x.id}}">{{x.name}}</option>' +
                  '</select>' +
                  '</div>' +
                  '<div class="col">' +
                  '<a class="icon-delete-produk" ng-click="hpsKtg()" style="margin-left:20px; font-size:25px;"><i class="fa fa-trash"></a></i>' +
                  '</div>' +
                  '</div>' +
                  '<div class="row">' +
                  '<div class="col">' +
                  '<label style="margin-top:0px;">Ubah Nama Produk</label>' +
                  '<input class="input-select" style="font-size: smaller; max-height: 25px;" type="text" ng-model="data.tmp_nama" placeholder="Masukkan nama baru"/>' +
                  '</div>' +
                  '</div>' +
                  '</div>',
               title: 'Sunting Produk',
               subTitle: 'Silahkan memilih Produk',
               scope: $scope,
               buttons: [{
                  text: 'Batal'
               }, {
                  text: '<b>Simpan</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                     if (!$scope.data.tmp_nama) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                     } else if (!$scope.data.tmp_ktg) {
                        //jika kategori tidak terpilih
                        e.preventDefault();
                     } else {
                        var tmpData = {
                           token: localStorage.getItem("token"),
                           device: localStorage.getItem("deviceUUID"),
                           user_id: localStorage.getItem("id"),
                           name: $scope.data.tmp_nama.toUpperCase(),
                           id: $scope.data.tmp_ktg
                        };
                        $http({
                              method: "POST",
                              url: config.server + "category/save/" + $scope.data.tmp_ktg,
                              data: tmpData,
                              headers: {
                                 'Content-Type': 'application/x-www-form-urlencoded'
                              }
                           })
                           .success(function(produk) {
                              
                              if (!produk.success) {
                                 alert("Gagal mengirim data");
                              };
                           });
                        var isedited = 1;
                        localStorage.setItem("isEdited", isedited);
                        //tarik data kembali dari server
                        $scope.loads();
                     }
                  }
               }]
            });
            $scope.hpsKtg = function() {
               var tsData = {
                  token: localStorage.getItem("token"),
                  device: localStorage.getItem("deviceUUID"),
                  user_id: localStorage.getItem("id"),
                  active: 0,
                  id: $scope.data.tmp_ktg
               };
               $http({
                     method: "POST",
                     url: config.server + "category/save/" + $scope.data.tmp_ktg,
                     data: tsData,
                     headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                     }
                  })
                  .success(function(produk) {
                     
                     if (!produk.success) {
                        alert("Gagal mengirim data");
                     };
                  });
                var isedited = 1;
                localStorage.setItem("isEdited", isedited);
               //tarik data kembali dari server
               $scope.loads();
            };
         };
      };
      // };    
      // Edit bagian detail jenis
      $scope.disabled = true;
      $scope.edit = function() {
            if ($scope.disabled == true) {
               $scope.disabled = false;
               $scope.iconEdit = {
                  'color': 'black',
                  'font-weight': 'bold',
               }
            } else {
               $scope.disabled = true;
               $scope.iconEdit = {
                  'color': 'white',
                  'font-weight': 'regular',
               }
            }
         }
         //Edit bagian kategori barang
      $scope.disabled1 = true;
      $scope.edit1 = function() {
         if ($scope.disabled1 == true) {
            $scope.disabled1 = false;
            $scope.iconEdit = {
               'color': 'black',
               'font-weight': 'bold',
            }
         } else {
            $scope.disabled1 = true;
            $scope.iconEdit = {
               'color': 'white',
               'font-weight': 'regular',
            }
         }
      }
      //http://localhost:8080/pos-api/products/qrcode/id/code/nama/harga/siz

      
      //$scope.QRcode = $rootScope.serverUrl + 'products/qrcode/' + $stateParams.id + '/' + $scope.produklist.code + '/' + $scope.produklist.name + '/' + $scope.param.productUnitPrice[0] + '/' + '6';      
   };
})();