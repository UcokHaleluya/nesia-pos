 (function () {

      'use strict'; 

      angular.module('starter').controller('gudangCtrl', ['$state','$rootScope', '$scope', '$http', '$ionicLoading','$ionicSlideBoxDelegate','$ionicPopup' ,gudangCtrl]);

      function gudangCtrl($state, $rootScope, $scope, $http, $ionicLoading, $ionicSlideBoxDelegate, $ionicPopup){
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
		    // Jika logo Bisnis kosong
		    if(!$rootScope.dataBusiness.logo) {
		      $rootScope.dataBusiness.logo = "img/logobisnis.png";
		    }
		    // DATA ROLE
		    $rootScope.dataRole = JSON.parse(localStorage.getItem("userInfo")).role;           
            var isFristLogin = localStorage.getItem('isFirstLogin');
            var firstLogin;
            isFristLogin = JSON.parse(isFristLogin);
            if (isFristLogin == 1) {

                $scope.loadWarehouse();
                $scope.loadProduct();
                $scope.loadCtg();
                $rootScope.first();  

                firstLogin = 0;             
                localStorage.setItem('isFirstLogin', firstLogin);
                localStorage.setItem('isEdited', firstLogin);
            } else {
                $scope.showFrontEnd();
            };            
            var isEdited = localStorage.getItem('isEdited');
            var edited;
            isEdited = JSON.parse(isEdited);
            if (isEdited == 1) {
                $scope.loadWarehouse();
                $scope.loadProduct();
                $scope.loadCtg();
                $rootScope. first();
                
                edited = 0;
                localStorage.setItem('isFirstLogin', edited);
                localStorage.setItem('isEdited', edited);
            } else {
                $scope.showFrontEnd();
            };            
		  });

		  $scope.loadWarehouse = function() {
		  	$rootScope.ionicLoading([]);            
		  	var parameter = {
		  		token: localStorage.getItem("token"),
            	device: localStorage.getItem("deviceUUID")
		  	};
		  	$http({
                    method: "POST",
                    url: config.server + "warehouses",
                    data: parameter,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
            })
            .success(function(feedback) {
                console.log("Response gudang", feedback);
                // Response sukses
                if (feedback.success) {
                    var tmp = JSON.stringify(feedback.data);
                    localStorage.setItem("listWarehouses", tmp);
                    $rootScope.warehouses = feedback.data;
                    $scope.linksId = feedback.data[0].id;
                    $scope.namas = feedback.data[0].name;
                    $rootScope.ionicLoadingHide();
                    // alert(JSON.stringify($scope.warehouses.data));
                } else {
                	$rootScope.ionicLoadingHide();
                	$rootScope.toast('masi perbaiki');
                };
            }).error(function(){
	        	$rootScope.ionicLoadingHide();
                $rootScope.toast("terjadi kesalahan pada server");
	    	});                
		  };//loadwarehouse

          $scope.ware = {};          
          $scope.saveWarehouse = function(idWarehouse){
            var warehouseData = {};
            if (!$scope.unEditable) {
                if ($scope.ware.name) {
                    warehouseData.name = $scope.ware.name;
                };
                if ($scope.ware.address) {
                    warehouseData.address = $scope.ware.address;
                };
                if ($scope.ware.nohp) {
                    warehouseData.phone = $scope.ware.nohp;
                };
                if (Object.keys(warehouseData).length > 0) {
                    var myPopup = $ionicPopup.show({
                        template: 'Apakah anda yakin mengubah data gudang ?',
                        title: 'Pemberitahuan',
                        scope: $scope,
                        buttons: [{
                            text: 'Batal',
                            onTap: function(e) {}
                        }, {
                            text: 'Ubah',
                            type: 'button-positive',
                            onTap: function(e) {
                                $rootScope.ionicLoading("EditWarehouse");
                                $rootScope.http("/warehouse/save/" + idWarehouse, warehouseData, 
                                    function(response){
                                        if (response.success) {
                                            $scope.ware.name = "";
                                            $scope.ware.address = "";
                                            $scope.ware.nohp = "";
                                            $rootScope.toast("Gudang Berhasil disimpan");
                                            $scope.loadWarehouse();
                                            
                                        }else{
                                            $rootScope.toast(response.message);
                                        };                                                                     
                                }, function(){ // error                               
                                    $rootScope.toast('Gagal terhubung ke server');
                                },function(){  // complete                                  
                                    $rootScope.ionicLoadingHide("EditWarehouse");
                                });

                            }// func Tambah
                        }]
                    })
                   
                };

            };
          };
          $rootScope.warehouses = {};
          $scope.showFrontEnd = function(){
            //Data Gudang
            var listWarehouses = localStorage.getItem("listWarehouses");
            if (listWarehouses || listWarehouses != null) {
                listWarehouses = JSON.parse(listWarehouses);            
                $rootScope.warehouses = listWarehouses;
                $scope.linksId = listWarehouses[0].id;
                $scope.namas = listWarehouses[0].name;
            };
            //end Of Data Gudang            
            
            //Data produlk
            var prdcts = localStorage.getItem("Prod-ware");
            if (prdcts || prdcts != null) {
                prdcts = JSON.parse(prdcts);
                $rootScope.products = prdcts;               
                var sorted = [];
                for(var att in $rootScope.products){
                    if (sorted.length < 1) {
                        sorted.push($rootScope.products[att]);
                    } else {
                        var checked = false;
                        for (var i = sorted.length - 1; i >= 0; i--) {
                            if ($rootScope.products[att].warehouse_id == sorted[i].warehouse_id) {
                                if ($rootScope.products[att].product_id == sorted[i].product_id) {
                                    sorted[i].qty = parseFloat(sorted[i].qty) + parseFloat($rootScope.products[att].qty);
                                    checked = true;                                            
                                };
                            };
                        };
                        if (!checked) {
                            sorted.push($rootScope.products[att]);
                        };
                    };
                };
                $rootScope.products = sorted;                
            };
            //End of Data produk
          };
          $scope.scanBarcode = function() {
            var prd = localStorage.getItem("listProduk");
            prd = JSON.parse(prd);
            for(var attr in prd){
                if (prd.id == data.imageText) {
                    $state.go("pos.produk-detail", {id : data.imageText});
                    break;
                };
            };
            var result = $rootScope.scanBarcode(
                function(data){

                }, function(){
                    $rootScope.toast("Gagal memindai gambar");
                }
            );            
          };
          $scope.tambahGudang = function(){            
            $scope.data = {};
            var myPopup = $ionicPopup.show({
                template: '<input type="text" class="input-select" placeholder="Nama gudang baru" ng-model="data.nama">'+
                          '<br>'+
                          '<input type="text" class="input-select" placeholder="Alamat gudang baru" ng-model="data.address">'+
                          '<br>'+
                          '<input type="text" class="input-select" placeholder="No. Telepon baru" ng-model="data.phone">',
                title: 'Tambah Gudang baru',
                scope: $scope,
                buttons: [{
                    text: 'Batal',
                    onTap: function(e) {}
                }, {
                    text: 'Simpan',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.nama) {
                            e.preventDefault();
                        } else {
                            var data = {                                
                                token: localStorage.getItem("token"),
                                device: localStorage.getItem("deviceUUID"),
                                name : $scope.data.nama,
                                address : $scope.data.address,
                                phone : $scope.data.phone
                            };
                            $rootScope.ionicLoading("AddWarehouse");
                            $rootScope.http('warehouse/save', data, 
                                function(response){
                                    if (response.success) {
                                            //showkategori
                                            $rootScope.toast('Gudang berhasil di tambahkan')
                                        $scope.loadWarehouse();
                                            //akhir show kategori
                                    }else{
                                        $rootScope.toast(response.message);
                                    }
                                },
                                function(){
                                    $rootScope.toast('Gagal terhubung ke server');
                                },
                                function(){
                                    $rootScope.ionicLoadingHide("AddWarehouse");
                                }
                            );
                        }
                    }
                }]
            })
          };

		  $scope.loadProduct = function() {
            $rootScope.ionicLoading([]);
		  	var parameter = {
		  		token: localStorage.getItem("token"),
            	device: localStorage.getItem("deviceUUID")
		  	};
            $rootScope.http("warehouse-products", {images : $scope.images},
                function(feedback){
                    if (feedback.success) {
                        $rootScope.products = feedback.data;
                        localStorage.setItem("Prod-ware", JSON.stringify(feedback.data));
                        var sorted = [];
                        for(var att in $rootScope.products){
                            if (sorted.length < 1) {
                                sorted.push($rootScope.products[att]);
                            } else {
                                var checked = false;
                                for (var i = sorted.length - 1; i >= 0; i--) {
                                    if ($rootScope.products[att].warehouse_id == sorted[i].warehouse_id) {
                                        if ($rootScope.products[att].product_id == sorted[i].product_id) {
                                            sorted[i].qty = parseFloat(sorted[i].qty) + parseFloat($rootScope.products[att].qty);
                                            checked = true;                                            
                                        };
                                    };
                                };
                                if (!checked) {
                                    sorted.push($rootScope.products[att]);
                                };
                            };
                        };
                        $rootScope.products = sorted;
                        localStorage.setItem("Prod_ware_sorted", JSON.stringify(sorted));
                        $rootScope.http("/suppliers", $scope.daa,function(res){
                            if (res.success) {
                                $scope.listSupplier = res.data;
                                localStorage.setItem("suppliers", JSON.stringify($scope.listSupplier));
                            } else {
                                $rootScope.ionicAlert($ionicPopup, res.message, "Pemberitahuan");                    
                            };
                        },function(){
                            $rootScope.ionicAlert($ionicPopup, "Gagal terhubung ke server", "Pemberitahuan");
                        });                       
                        console.log("sorted item", $rootScope.products);
                        $rootScope.ionicLoadingHide();
                    } else { ///end if
                        $rootScope.ionicLoadingHide();
                        $rootScope.toast(feedback.message);
                    };
            },function(){
                $rootScope.ionicLoadingHide();
                $rootScope.toast("Gagal terhubung ke server");
            },function(){
                $rootScope.ionicLoadingHide();
            });		  	               
		  }; 
       $scope.hapusGudang = function(idGudang, namaGudang){
            var tmp = localStorage.getItem("listWarehouses");
            tmp = JSON.parse(tmp);
            for (var i = 0; i < tmp.length; i++) {
                if (tmp[i].id == idGudang && tmp[i].code == '01') {
                    $rootScope.toast("Gudang default tidak boleh di hapus");     
                    return;
                }
            }
            
            var myPopup = $ionicPopup.show({
                template: 'Apakah anda yakin ingin menghapus gudang ' + namaGudang + ' ?',
                title: 'Konfirmasi',
                scope: $scope,
                buttons: [{
                    text: 'Batal',
                    onTap: function(e) {}
                }, {
                    text: 'Hapus',
                    type: 'button-positive',
                    onTap: function(e) {    
                            $rootScope.ionicLoading("DelWarehouse");
                            $rootScope.http("warehouse/del/" + idGudang, null,
                                function(response){
                                    if (response.success) {
                                            //showkategori
                                        $rootScope.toast('Gudang telah di hapus');
                                        $scope.loadWarehouse();                        
                                            //akhir show kategori
                                    }else{
                                        $rootScope.toast(response.message);
                                    }
                                },
                                function(){
                                    $rootScope.toast('Gagal terhubung ke server');
                                },
                                function(){
                                    $rootScope.ionicLoadingHide("DelWarehouse");                    
                                }
                            );                        
                    }
                }]
            })
       };


        $scope.loadCtg = function(){
            var categories = localStorage.getItem("categories");
            if (categories == null) {
                $rootScope.http('categories', {
                        user_id: localStorage.getItem('id')
                    },
                    function(response) {
                        if (response.success) {
                            var kategori_list = response;
                            $scope.categories = response.data;
                            localStorage.setItem("categories", JSON.stringify(kategori_list));
                        }
                    },
                    function() {
                        $rootScope.toast('Gagal terhubung ke server');
                    },
                    function() {
                        $rootScope.ionicLoadingHide('categories');
                    }
                );
            } else {
                $scope.categories = JSON.parse(categories).data;
                $rootScope.ionicLoadingHide('categories');
            }
        };

        $scope.produtDetail = function(prodId){
            angular.forEach($scope.products, function(value, key) {
                // console.log(value.user_id);
                if (value.id == prodId) {
                    $scope.prodDetal = $scope.products[key];
                    $scope.key = key;
                }
            });
            $state.go("pos.tambahStok", {data : JSON.stringify($scope.prodDetal)});
        };

       $scope.sendLink = function(index){
            var warehouses = $scope.warehouses[index];
            $scope.linksId = warehouses.id;
            $scope.namas = warehouses.name;           
       };       
        $scope.unEditable = true;
        $scope.enabled = function() {
            if ($scope.disabled == true) {
            $scope.disabled = false;
            $scope.iconEdit = {
               'color': 'white',
               'font-weight': 'regular',
            }
         } else {
            $scope.disabled = true;
            $scope.iconEdit = {
               'color': 'black',
               'font-weight': 'bold',
            }
         };
            if ($scope.unEditable == true) {
                $scope.unEditable = false;
            } else {
                $scope.unEditable = true;
            };            
        };

      };      
})();