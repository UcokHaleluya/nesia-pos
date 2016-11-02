(function () {

      'use strict';

      angular.module('starter').controller('perpindahanGudangCtrl', ['$rootScope', '$scope', '$http', '$state', '$stateParams', '$ionicLoading', '$ionicPopup', perpindahanGudangCtrl]);

      function perpindahanGudangCtrl($rootScope, $scope, $http, $state, $stateParams, $ionicLoading, $ionicPopup){
          var vm = this;

          // User Info Update
		  $scope.$on('$ionicView.enter', function() {
		    // SIMPAN SEMUA DATA USER
		    // DATA USER
		     $rootScope.ionicLoading(['salesmen', 'categories', 'warehouses', 'warehouse-products']);

            // SIMPAN SEMUA DATA USER
            // DATA USER
            $rootScope.dataUser = JSON.parse(localStorage.getItem("userInfo")).user;
            console.log('user', $rootScope.dataUser);
            // DATA PROFILE
            $rootScope.dataProfile = JSON.parse(localStorage.getItem("userInfo")).profile;
            // DATA BUSINESS
            $rootScope.dataBusiness = JSON.parse(localStorage.getItem("userInfo")).business;
            // Jika logo Bisnis kosong
            if (!$rootScope.dataBusiness.logo) {
                $rootScope.dataBusiness.logo = "img/logobisnis.png";
            }            
		  });
		  $scope.ask = $stateParams.id;
		  var categories = localStorage.getItem("categories");
		  if (categories) {
		  	$scope.categories = JSON.parse(categories);
		  };	  		 		 
		  var warehouses = localStorage.getItem("listWarehouses");
		  if (warehouses || warehouses != null) {
		  	$scope.tmpWarehouse = JSON.parse(warehouses);
		  	$scope.anotherWarehouses = [];
		  	for(var attr in $scope.tmpWarehouse){
			  	if ($scope.tmpWarehouse[attr].id == $stateParams.id) {
			  		$scope.namaGUdang = $scope.tmpWarehouse[attr].name;
			  	} else {
			  		$scope.anotherWarehouses.push($scope.tmpWarehouse[attr]);
			  	};
			  };		  	
		  } else {
		  	$rootScope.toast("Terjadi kesalahan.");
		  	$state.go("pos.gudang");
		  };

		  var str = localStorage.getItem("Prod_ware_sorted");
		  if (str || str != null) {
		  	var tmpProducts = JSON.parse(str);
		  } else {
		  	$rootScope.toast("kesalahan saat memuat produk");
		  	$state.go("pos.gudang");
		  };
		  $scope.products = [];
		  for(var atr in tmpProducts){
		  	if (tmpProducts[atr].warehouse_id == $stateParams.id) {
		  		$scope.products.push(tmpProducts[atr]);
		  	};
		  };
		  console.log("products" , $scope.products);
		  $scope.sendItem ={};
		  $scope.productsSelected = function(e){		  	
		  	$scope.productDetail = e;
		  	$scope.sendItem.jumlah = 1;
		  };

		  $scope.decreseStock = function(pId,q){
		  	var e = localStorage.getItem("Prod_ware_sorted");
		  	e = JSON.parse(e);
		  	for(var at in e){
		  		if (e[at].product_id == pId && e[at].warehouse_id == $stateParams.id) {
		  			if (parseFloat(e[at].qty) < parseFloat(q)) {
		  				$rootScope.toast("Jumlah Stok tidak cukup");
		  				return false;
		  			} else {
		  				e[at].qty = parseFloat(e[at].qty) - parseFloat(q);
		  				break;	  				
		  			};
		  		};
		  	};
		  	localStorage.setItem("Prod_ware_sorted", JSON.stringify(e));
		  	var str = localStorage.getItem("Prod_ware_sorted");
			if (str || str != null) {
				var tmpProducts = JSON.parse(str);
			} else {
				$rootScope.toast("kesalahan saat memuat produk");
				$state.go("pos.gudang");
			};
			$scope.products = [];
			for(var atr in tmpProducts){
				if (tmpProducts[atr].warehouse_id == $stateParams.id) {
					$scope.products.push(tmpProducts[atr]);
				};
			};
			return true;
          };

          $scope.increaseStock = function(pId,q){
          	var e = localStorage.getItem("Prod_ware_sorted");
		  	e = JSON.parse(e);
		  	for(var at in e){
		  		if (e[at].product_id == pId  && e[at].warehouse_id == $stateParams.id) {		  			
		  			e[at].qty = parseFloat(e[at].qty) + parseFloat(q);		  			
		  		};
		  	};
		  	localStorage.setItem("Prod_ware_sorted", JSON.stringify(e));
		  	var str = localStorage.getItem("Prod_ware_sorted");
			if (str || str != null) {
				var tmpProducts = JSON.parse(str);
			} else {
				$rootScope.toast("kesalahan saat memuat produk");
				$state.go("pos.gudang");
			};
			$scope.products = [];
			for(var atr in tmpProducts){
				if (tmpProducts[atr].warehouse_id == $stateParams.id) {
					$scope.products.push(tmpProducts[atr]);
				};
			};			
          };

		  $scope.sendParameter = [];
		  $scope.itemForSent = function(prodId, item){		  
		  	$scope.helperVariable = {};
		  	$scope.helperVariable.product_id = prodId;
	  		$scope.helperVariable.qty = item.jumlah;
	  		$scope.helperVariable.unit_id = item.unit;
	  		$scope.helperVariable.to_warehouse = item.gudang;
	  		if (!$scope.helperVariable.qty || $scope.helperVariable.qty == null) {
	  			$rootScope.toast("Jumlah barang tidak boleh kosong (Min.1).")
	  			return;
	  		};
	  		if (!$scope.helperVariable.unit_id || $scope.helperVariable.unit_id == null) {
	  			$rootScope.toast("Pilih salah satu Satuan Unit barang.")
	  			return;
	  		};
	  		if (!$scope.helperVariable.to_warehouse || $scope.helperVariable.to_warehouse == null) {
	  			$rootScope.toast("Pilih salah satu Gudang tujuan.")
	  			return;
	  		};	  			  	
  			if ($scope.sendParameter.length <= 0) {
  				var u = $scope.decreseStock($scope.helperVariable.product_id, $scope.helperVariable.qty);
				if (!u || u == false) {
					return;
				};
		  		$scope.sendParameter.push($scope.helperVariable);	
		  	} else {
		  		var checkStatus = false;
		  		for (var i = $scope.sendParameter.length - 1; i >= 0; i--) {
		  			if ($scope.sendParameter[i].product_id == $scope.helperVariable.product_id) {
		  				if ($scope.sendParameter[i].to_warehouse == $scope.helperVariable.to_warehouse) {
		  					if ($scope.sendParameter[i].unit_id == $scope.helperVariable.unit_id) {
		  						var u = $scope.decreseStock($scope.helperVariable.product_id, $scope.helperVariable.qty);
		  						if (!u || u == false) {
		  							return;
		  						};
		  						$scope.sendParameter[i].qty = parseFloat($scope.sendParameter[i].qty) + parseFloat($scope.helperVariable.qty);
		  						checkStatus = true;
		  					} else {
		  						var u = $scope.decreseStock($scope.helperVariable.product_id, $scope.helperVariable.qty);
		  						if (!u || u == false) {
		  							return;
		  						};
		  						$scope.increaseStock($scope.sendParameter[i].product_id,$scope.sendParameter[i].qty);
		  						$scope.sendParameter[i] = $scope.helperVariable;
		  						checkStatus = true;
		  					};
		  				};
		  			};		  			
		  		};
		  		if (checkStatus == false) {
		  			var u = $scope.decreseStock($scope.helperVariable.product_id, $scope.helperVariable.qty);
					if (!u || u == false) {
						return;
					};
		  			$scope.sendParameter.push($scope.helperVariable);
		  		};
		  	};
		  };//aaa end func

		  $scope.prod_delete = function(index, qty, prdId) {
            $scope.sendParameter.splice(index, 1);
            $scope.increaseStock(prdId,qty);
          };

          $scope.displayers = {};
          $scope.displayName = function(prodId){
          	var helperVar = localStorage.getItem("Prod_ware_sorted");
          	helperVar = JSON.parse(helperVar);
          	for(var z in helperVar){
          		if (helperVar[z].product_id == prodId) {
          			$scope.displayers = helperVar[z];
          			return helperVar[z].product_name;
          		};
          	};
          };

          $scope.displayUnitName = function(uId){          	
          	for(var j in $scope.displayers.units){
          		if ($scope.displayers.units[j].id_unit == uId) {
          			return $scope.displayers.units[j].unit;
          		};
          	};
          };

          $scope.displayWarehouseName = function(wareId){
          	var helperVar = localStorage.getItem("listWarehouses");
          	helperVar = JSON.parse(helperVar);
          	for(var x in helperVar){
          		if (helperVar[x].id == wareId) {
          			return helperVar[x].name;
          		};
          	};
          };         
          $scope.pushItem = function(){
          	if ($scope.sendParameter.length < 1) {
          		$rootScope.toast("Tidak ada barang yang terkirim.");
          		return;
          	};
          	 $rootScope.ionicLoading([]);
          	$rootScope.http('warehouse-transfer', {
                    from_warehouse : $stateParams.id,
                    items : $scope.sendParameter
                },
                function(response) {
                    if (response.success) {
                        console.log("respon", response);                        
                        $rootScope.ionicLoadingHide();
                        $scope.endingPopup();
                    } else {
                        // Popup pesan respon
                        $rootScope.ionicLoadingHide();
                        $rootScope.ionicAlert($ionicPopup, response.message);
                    }
                },
                function() { // error
                    $rootScope.toast("Gagal terhubung ke server");
                },
                function() { // complete
                    $rootScope.ionicLoadingHide();                    
                }
            );
          };

          $scope.loadProduct = function() {
          	 $rootScope.ionicLoading([]);
		  	var parameter = {
		  		token: localStorage.getItem("token"),
            	device: localStorage.getItem("deviceUUID")
		  	};
		  	$http({
                    method: "POST",
                    url: config.server + "warehouse-products",
                    data: parameter,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .success(function(feedback) {
                    console.log("Response product", feedback);
                    // Response sukses
                    if (feedback.success) {
                        $rootScope.products = feedback.data;
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
                                            break;
                                        };
                                    };
                                };
                                if (!checked) {
                                    sorted.push($rootScope.products[att]);
                                };
                            };
                        };                        
                        localStorage.setItem("Prod-ware", JSON.stringify(feedback.data));                                                
                        localStorage.setItem("Prod_ware_sorted", JSON.stringify(sorted));                        
                        $rootScope.ionicLoadingHide();
                    } else {
                    	$rootScope.ionicLoadingHide();
                    	alert(feedback.message);
                    };
                }).error(function(){
		        	$rootScope.ionicLoadingHide();
                    alert("terjadi kesalahan pada server");
		    	});                
		  };
          $scope.endingPopup = function(){
          	$scope.data = {};
			  // An elaborate, custom popup
			  var myPopup = $ionicPopup.show({
			    template: '',
			    title: 'Konfirmasi',
			    subTitle: 'Transfer barang lagi ?',
			    scope: $scope,
			    buttons: [
			      { text: 'Tidak', 
			      	type: 'button-positive',
			      	onTap: function() {
			      		var edited = 1;
                		localStorage.setItem('isEdited', edited);
			      		$state.go("pos.gudang");
			      	}
			  	  },
			      
			      {
			        text: '<b>Iya</b>',
			        type: 'button-positive',
			        onTap: function(e) {			        	
			          	$scope.loadProduct();
			          	$scope.sendParameter = [];
			          	$scope.productDetail = {};
			        }
			      }
			    ]
			  });
          };//endoffunc
      };

})();