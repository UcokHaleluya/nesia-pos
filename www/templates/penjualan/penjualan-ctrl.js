(function() {

    'use strict';

    /**
     * @memberof starter
     * @ngdoc controller
     * @name penjualanCtrl
     * @param $rootScope {service} controller root scope
     * @param $scope {service} controller scope
     * @param $ionicPopup {service} controller ionic poup
     */
 
    angular.module('starter').controller('penjualanCtrl', ['$rootScope', '$scope', '$http', '$ionicPopup', '$ionicLoading', '$ionicTabsDelegate', '$ionicScrollDelegate', '$state', penjualanCtrl]);

    angular.module('starter').filter('filter_prod', function() {
        return function(items, filterValue, $scope) {
            if (filterValue === false) {
                return items;
            }; 
   
            if ((filterValue || angular.isUndefined(filterValue)) && angular.isArray(items)) {
                $scope.temp.selected_product = null;
                if (filterValue.warehouse_id) {
                    var newItems = [];
                    var duplicate = {};  
                    angular.forEach(items, function(item) {
                        if (item.warehouse_id == filterValue.warehouse_id) {
                            if (filterValue.category_id != undefined) {
                                if (item.parent_category == filterValue.category_id) {
                                    if (filterValue.name != undefined && item.product_name.toLowerCase().indexOf(filterValue.name.toLowerCase()) > -1) {
                                        if (!duplicate[item.product_id]) {
                                            duplicate[item.product_id] = true;
                                            newItems.push(item);
                                        };
                                    } else if (filterValue.name == undefined) {
                                        if (!duplicate[item.product_id]) {
                                            duplicate[item.product_id] = true;
                                            newItems.push(item);
                                        };
                                    };
                                };
                            } else {
                                if (filterValue.name != undefined && item.product_name.toLowerCase().indexOf(filterValue.name.toLowerCase()) > -1) {
                                    if (!duplicate[item.product_id]) {
                                        duplicate[item.product_id] = true;
                                        newItems.push(item);
                                    };
                                } else if (filterValue.name == undefined) {
                                    if (!duplicate[item.product_id]) {
                                        duplicate[item.product_id] = true;
                                        newItems.push(item);
                                    };
                                };
                            };

                        };
                    });

                    return newItems;
                } else {
                    return null;
                };
            }
            return items;
        }
    });

    function penjualanCtrl($rootScope, $scope, $http, $ionicPopup, $ionicLoading, $ionicTabsDelegate, $ionicScrollDelegate, $state) {
        /**
         * @property {Hash} vm collection og objects that belongs to this penjualan controller
         */
        var vm = this;

        // set default value
        $scope.data = {};
        /*$scope.data.sales = null;
        $scope.data.customer = null;*/
        $scope.data.date = new Date();
        $scope.data.item = [];        
        $scope.data.discount_type = 0;
        $scope.show_detail = false;

        /**
         * Menjalankan parameter ketika ui tampil
         * @memberof penjualanCtrl
         * @function $scope.$on
         * @$ionicView.enter {Service} memasuki ui
         */
        // User Info Update
        $scope.$on('$ionicView.enter', function() {

            $rootScope.ionicLoading(['salesmen', 'categories', 'warehouses']);

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

            $rootScope.setting = JSON.parse(localStorage.getItem("setting"));
            //get sales
            var param = {
                token: localStorage.getItem("token"),
                device: localStorage.getItem("deviceUUID"),
                user_id: localStorage.getItem("id")
            };            
            $scope.products = {};
            $scope.salesmen = [];
            $scope.customers = [];
            $scope.show_detail = false;
            $scope.temp = {};
            $scope.temp.unit = [];
            $scope.temp.selected_product = null;  
            $scope.temp.search = '';          
            $scope.nullMsg = "Silahkan Cari Produk terlebih dahulu.";
            $rootScope.http('contacts', {
                    user_id: localStorage.getItem('id')
                },
                function(response) {
                    if (response.success) {
                        // Ambil data kontak
                        $scope.salesmen = response.data.salesmen;
                        $scope.salesmen.push({
                            user_id: null,
                            name: "Toko"
                        });
                        $scope.customers = response.data.customers;
                        /*$scope.customers.push({
                            user_id: null,
                            name: "Cash",
                            salesman: null
                        });*/
                        angular.forEach($scope.customers, function(item, index){
                            if (item.name === 'Cash') {
                                $scope.data.customer = item;
                            };
                        });
                        $scope.select_customer();
                    } else {
                        // Popup pesan respon
                        $rootScope.ionicAlert($ionicPopup, response.message);
                    }
                },
                function() { // error
                    $rootScope.toast("Gagal terhubung ke server");
                },
                function() { // complete
                    $rootScope.ionicLoadingHide('salesmen');
                }

                
                           
            );

            //get categories
            var categories = localStorage.getItem("categories");
            if (categories == null) {
                $rootScope.http('categories', {user_id: localStorage.getItem('id')},
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

            $rootScope.http('warehouses', {},
                function(response) {
                    if (response.success) {
                        $scope.warehouses = response.data[0];
                        if ($rootScope.setting.type == 'free' && $rootScope.setting.use_warehouse == 0) {
                            $scope.data.warehouse = $scope.warehouses;
                        };
                    };
                },
                function() {
                    $rootScope.toast('Gagal terhubung ke server');
                },
                function() {
                    $rootScope.ionicLoadingHide('warehouses');
                }
            );            

            // set default_tax
            var default_tax = localStorage.getItem("default_tax");
            default_tax = JSON.parse(default_tax);            
            $scope.temp.pajak_1 = default_tax;
            $scope.setting = {};
            $scope.setting = JSON.parse(localStorage.getItem('setting'));
            $scope.temp.disabled_sales = true;
            if ($rootScope.dataRole.name == 'admin') {
                $scope.temp.show_sales = true;
            } else {
                $scope.temp.show_sales = false;
            };

            //set default value
            $scope.data.payment_type = 'TUNAI';
            $scope.data.discount_type = '2';
            $scope.data.grand_total = 0;
            $scope.data.payment = "";
            $scope.data.change = 0;
            $scope.data.item = [];
            $scope.count_total_price();
        // var tmpSalesmen = {};
        //         tmpSalesmen.user_id = null;
        //         tmpSalesmen.name = "Toko";

        //         var tmpCustomers = {};
        //         tmpCustomers.user_id = null;
        //         tmpCustomers.name = "Cash";
        //         tmpCustomers.salesman = null;

        //         $scope.data.customer = tmpCustomers;
        //         $scope.data.salesman_id = tmpSalesmen;
        });

        $scope.productSearch = function(){
            $scope.products = {};
            $rootScope.ionicLoading(['warehouse-products']);
            $rootScope.http('search-products', {term : $scope.temp.search},
                function(response) {
                    if (response.success) {
                        $scope.products = response.data;
                        if ($scope.products.length < 1) {
                            $scope.nullMsg = "Produk tidak ditemukan";
                        };
                    } else {
                        $rootScope.toast(response.message);
                    };
                },
                function() {
                    $rootScope.toast('Gagal terhubung ke server');
                },
                function() {
                    $rootScope.ionicLoadingHide('warehouse-products');
                }
            );
        }

        /**
         * Tambah pelanggan
         * @memberof penjualanCtrl
         * @function tambahPelanggan
         */
        $scope.tambahPelanggan = function() {
            // Inisialisasi objek data
            $scope.customer_add = {}
            var salesOption = "";
            angular.forEach($scope.salesmen, function(value, key) {
                salesOption += '<option value="' + value.user_id + '">' + value.name + '</option>'
            });

            // Popup tambah pelanggan
            $scope.tambahPelangganPopup = $ionicPopup.show({

                template: '<input class="input-produk-detail" type="text" ng-model="customer_add.name" required placeholder="NAMA" style="margin: 10px auto !important;" />' +
                    '<input class="input-produk-detail" type="tel" ng-model="customer_add.mobile" required placeholder="HP" style="margin: 10px auto !important;" />' +
                    '<input class="input-produk-detail" type="text" ng-model="customer_add.address" required placeholder="ALAMAT" style="margin: 10px auto !important;" /> ' +
                    '<div class="h5 text-center" style="margin: 10px auto !important;">' +
                    '<select class="text-center warna-select input-select" ng-model="customer_add.sales">' +
                    salesOption +
                    '</select>' +
                    '</div>',
                title: 'TAMBAH PELANGGAN',
                subTitle: '',
                scope: $scope,
                buttons: [{
                    text: 'BATAL'
                }, {

                    text: '<b>SIMPAN</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        e.preventDefault();
                        if (!$scope.customer_add.name) {
                            $rootScope.toast("Nama customer tidak boleh kosong");
                        } else if (!$scope.customer_add.sales) {
                            $rootScope.toast("Silahkan pilih sales!");
                        } else {
                            $rootScope.ionicLoading([]);

                            var data = {
                                role_id: 2,
                                user_id: '@' + $rootScope.dataUser.user_id,
                                password: " ",
                                name: $scope.customer_add.name,
                                mobile: $scope.customer_add.mobile,
                                email: " ",
                                address: $scope.customer_add.address,
                                is_sales_module: true
                            }

                            $rootScope.http('user/register', data,
                                function(response) {
                                    if (response.success) {
                                        if($scope.customer_add.sales==null || $scope.customer_add.sales == "null"){
                                            $rootScope.http('contacts/customers', {},
                                                function(response) {
                                                    if (response.success) {
                                                        // Ambil data kontak
                                                        $scope.customers = [];
                                                        $scope.customers = response.data;
                                                        for (var i = 0; i < $scope.customers.length; i++) {
                                                            if ($scope.customers[i].name === 'Cash') {
                                                                $scope.data.customer = $scope.customers[i];
                                                                break;
                                                            };
                                                        };
                                                        $scope.closePopUp();
                                                        return $scope.customer_add;
                                                    }
                                                },
                                                function() { // error
                                                    $rootScope.toast("Gagal terhubung ke server");
                                                },
                                                function() { // complete
                                                    $rootScope.ionicLoadingHide();
                                                }
                                            );
                                        } else {
                                            $rootScope.http('customer-salesman/' + response.data.id, {
                                                    salesman_id: $scope.customer_add.sales
                                                },
                                                function(response) {
                                                    if (response.success) {
                                                        $rootScope.http('contacts/customers', {},
                                                            function(response) {
                                                                if (response.success) {
                                                                    // Ambil data kontak
                                                                    $scope.customers = [];
                                                                    $scope.customers = response.data;
                                                                    for (var i = 0; i < $scope.customers.length; i++) {
                                                                        if ($scope.customers[i].name === 'Cash') {
                                                                            $scope.data.customer = $scope.customers[i];
                                                                            break;
                                                                        };
                                                                    };
                                                                    $scope.closePopUp();
                                                                    return $scope.customer_add;
                                                                }
                                                            },
                                                            function() { // error
                                                                $rootScope.toast("Gagal terhubung ke server");
                                                            },
                                                            function() { // complete
                                                                $rootScope.ionicLoadingHide();
                                                            }
                                                        );
                                                    } else {
                                                        $rootScope.toast(response.message);
                                                        $rootScope.ionicLoadingHide();
                                                    };
                                                },
                                                function() {
                                                    $rootScope.toast('Gagal terhubung ke server');
                                                    $rootScope.ionicLoadingHide();
                                                }
                                            );
                                        };
                                        
                                    } else {
                                        $rootScope.toast(response.message);
                                        $rootScope.ionicLoadingHide();
                                    };
                                },
                                function() {
                                    $rootScope.toast('Gagal terhubung ke server');
                                    $rootScope.ionicLoadingHide();
                                }
                            );
                        }
                    }

                }, ]

            });
        }

        $scope.closePopUp = function() {
            $scope.tambahPelangganPopup.close();
        }


        /**
         * Cara pembayaran
         * @memberof penjualanCtrl
         * @function caraPembayaran
         */
        $scope.caraPembayaran = function() {

            // Inisialisasi objek data
            $scope.data = {}

            // Popup cara pembayaran
            var caraPembayaranPopup = $ionicPopup.show({


                title: 'PEMBAYARAN',
                subTitle: '',
                scope: $scope,
                buttons: [{
                    text: 'BATAL'
                }, {

                    text: '<b>BAYAR</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.nama) {
                            e.preventDefault();
                        } else {
                            return $scope.data;
                        }
                    }

                }, ]

            });

            // Popup konfirmasi cara pembayaran
            caraPembayaranPopup.then(function(res) {
                // Konfirmasi OK
                if (res) {
                    alert(JSON.stringify($scope.data));
                }
                // Konfirmasi Cancel
                else {

                }

            });
        }

        $scope.select_customer = function() {
            $scope.temp.show_sales = ($rootScope.dataRole.name == "admin") ? true : false;
            if ($scope.data.customer.salesman) {
                $scope.data.salesman_id = $scope.data.customer.salesman.user_id;
                $scope.temp.disabled_sales = true;
            } else {
                if ($rootScope.setting.cash_type == "toko") {
                    $scope.data.salesman_id = null;
                    $scope.temp.disabled_sales = true;
                } else {
                    $scope.data.salesman_id = -1;
                    $scope.temp.disabled_sales = false;
                    $scope.temp.show_sales = true;
                };
            };
        }

        $scope.product_click = function(item) {
            $scope.show_detail = true;
            $scope.temp.product = item;
            $scope.temp.jumlah = 1;
            $scope.temp.unit = item.units[0];
        }

        $scope.unit_change = function(unit) {
            $scope.temp.unit = unit
        }

        $scope.prod_add = function() {
            if ($scope.temp.jumlah < 1 || $scope.temp.jumlah == undefined || $scope.temp.jumlah == null) {
                $rootScope.toast("Jumlah barang minimal 1!");
                return;
            };
            var prod = $scope.temp.product;
            var unit = $scope.temp.unit;
            var isNew = true;
            for(var attr in $scope.data.item){
                if (prod.product_id == $scope.data.item[attr].product_id) {
                    if (unit.unit_id == $scope.data.item[attr].unit_id) {
                        $scope.data.item[attr].jumlah = parseFloat($scope.data.item[attr].jumlah) + parseFloat($scope.temp.jumlah);
                        var newTotal = parseFloat($scope.temp.jumlah) * parseFloat(unit.price);
                        var discountValue = (parseFloat(prod.product_discount) / 100) * newTotal;
                        newTotal = newTotal - discountValue;
                        $scope.data.item[attr].total_price = parseFloat($scope.data.item[attr].total_price) + parseFloat(newTotal);
                        isNew = false;
                    };
                };
            };                        
            if (isNew) {
                    var total = parseFloat($scope.temp.jumlah) * parseFloat(unit.price);
                    var hargaDiskon = (parseFloat(prod.product_discount) / 100) * total;
                    total = total - hargaDiskon;
                    var item = {
                    code: prod.code,
                    product_id: prod.product_id,
                    product_name: prod.product_name,
                    jumlah: $scope.temp.jumlah,
                    discount: prod.product_discount,
                    price: unit.price,
                    total_price: total,
                    unit_id: unit.id_unit,
                    unit: unit.unit
                };
                $scope.data.item.push(item);
            };
            $scope.count_total_price();
        }

        $scope.prod_delete = function(index) {
            $scope.data.item.splice(index, 1);
            $scope.count_total_price();
        }

        $scope.count_total_price = function() {
            $scope.data.sub_total_1 = 0;
            angular.forEach($scope.data.item, function(elm) {
                $scope.data.sub_total_1 += elm.total_price;
            });

            var pajak_1 = 0;
            $scope.data.pajak_1 = 0;
            $scope.data.pajak_1_price = 0;
            if ($scope.temp.pajak_1) {
                pajak_1 = 0.01 * $scope.temp.pajak_1;
                $scope.data.pajak_1 = pajak_1;
                $scope.data.pajak_1_price = pajak_1 * $scope.data.sub_total_1;
            };

            $scope.data.pajak_2_price = 0;
            $scope.data.pajak_2 = $scope.temp.pajak_2;
            $scope.data.pajak_2_type = $scope.temp.pajak_2_type;
            if ($scope.temp.pajak_2 && $scope.temp.pajak_2_type) {
                //var sub_price = $scope.data.sub_total_1 + $scope.data.pajak_1_price;
                if ($scope.temp.pajak_2_type == 1) {
                    $scope.data.pajak_2_price = $scope.temp.pajak_2;
                } else {
                    $scope.data.pajak_2_price = $scope.data.sub_total_1 * ($scope.temp.pajak_2 * 0.01);
                };
            };

            $scope.data.discount_price = 0;
            if ($scope.data.discount && $scope.data.discount_type) {
                if ($scope.data.discount_type == 1) {
                    $scope.data.discount_price = $scope.data.discount;
                } else {
                    $scope.data.discount_price = $scope.data.sub_total_1 * ($scope.data.discount * 0.01);
                };
            };

            $scope.data.sub_total_2 = $scope.data.sub_total_1 +
                $scope.data.pajak_1_price +
                $scope.data.pajak_2_price -
                $scope.data.discount_price;

            $scope.data.grand_total = $scope.data.sub_total_2;

            $scope.data.change = $scope.data.payment - $scope.data.grand_total;
        }

        $scope.save = function() {

            if (!$scope.data.warehouse) {
                $rootScope.toast("Silahkan pilih gudang!");
                return false;
            }

            if (!$scope.data.customer) {
                $rootScope.toast('Silahkan pilih pelanggan!');
                return false;
            }

            if (!$scope.data.salesman_id || $scope.data.salesman_id == -1) {
                if ($scope.data.customer.name === "Cash") {
                    if ($rootScope.setting.cash_type != 'toko') {
                        $rootScope.toast('Silahkan pilih sales!');
                        return false;
                    };
                } else {
                    $rootScope.toast('Silahkan pilih sales!');
                    return false;
                };
            }

            if (!$scope.data.item || $scope.data.item <= 0) {
                $rootScope.toast('Data transaksi tidak ada.');
                return false;
            }

            if (!$scope.data.payment_type) {
                $rootScope.toast('Silahkan pilih metode pembayaran!');
                return false;
            }

            if (!$scope.data.payment) {
                $rootScope.toast('Silahkan masukkan jumlah pembayaran');
                return false;
            }

            if ($scope.data.payment < $scope.data.grand_total) {
                $rootScope.toast('Jumlah pembayaran kurang dari total pembayaran.');
                return false;
            }

            var data = $scope.data;
            data.warehouse_id = data.warehouse.id;
            data.customer_id = (data.customer.user_id == 0) ? null : data.customer.user_id;
            data.is_delivered = $ionicTabsDelegate.selectedIndex();

            $rootScope.ionicLoading([]);
            $rootScope.http('sales', data,
                function(response) {
                    if (response.success) {
                        $rootScope.toast('Transaksi berhasil disimpan.');
                        $scope.data.warehouse = null;
                        $scope.data.date = new Date();
                        // $scope.data.customer = null;
                        $scope.data.salesman_id = -1;
                        $scope.data.item = [];
                        $scope.data.payment_type = null;
                        $scope.data.payment = '';
                        $scope.data.grand_total = '';

                        $scope.data.sub_total_1 = 0;
                        $scope.data.pajak_1 = 0;
                        $scope.data.pajak_1_price = 0;
                        $scope.data.pajak_2_price = 0;
                        $scope.data.pajak_2 = 0;
                        $scope.data.pajak_2_type = null;
                        $scope.data.discount = 0;
                        $scope.data.sub_total_2 = 0;
                        $scope.data.change = 0;
                        $scope.data.note = '';

                        $scope.temp.category = null;
                        $scope.temp.search = '';
                        $scope.temp.pajak_1 = 0;
                        $scope.temp.pajak_2 = 0;
                        $scope.temp.pajak_2_type = null;
                        $scope.temp.discount = 0;
                        $scope.data.discount_type = null;
                        $scope.show_detail = false;

                        angular.forEach($scope.customers, function(item, index){
                            if (item.name === 'Cash') {
                                $scope.data.customer = item;
                            };
                        });

                        $ionicScrollDelegate.scrollTop(true);
                        $state.go('pos.detail-penjualan',{param: response.data});
                    } else {
                        $rootScope.toast(response.message);
                    };
                },
                function() {
                    $rootScope.toast('Gagal terhubung ke server');
                },
                function() {
                    $rootScope.ionicLoadingHide();
                }
            );
        }

        $scope.scanBarcode = function() {
                //$scope.temp.product = {};
                var result = $rootScope.scanBarcode(
                    function(data) {
                        if (data.imageText) {
                            $rootScope.ionicLoading(['scanning1']);
                            $rootScope.http('search-barcode', {term : data.imageText},
                                function(response) {
                                    if (response.success) {
                                        $scope.products = response.data;                                        
                                        if ($scope.products.length < 1) {
                                            $scope.nullMsg = "Produk tidak ditemukan";
                                        } else {
                                            $scope.product_click(response.data[0]);
                                            // $scope.show_detail = true;
                                            // $scope.temp.product = response.data;
                                            // $scope.temp.product.code = response.data[0].code;
                                            // $scope.temp.product.units = response.data[0].units;
                                            // $scope.temp.jumlah = 1;
                                            // $scope.temp.unit = response.data[0].units[0];
                                            $rootScope.ionicLoadingHide('scanning1');
                                        };
                                    } else {
                                        $rootScope.toast(response.message);
                                    };
                                },
                                function() {
                                    $rootScope.toast('Gagal terhubung ke server');
                                },
                                function() {
                                    $rootScope.ionicLoadingHide('scanning1');
                                }
                            );
                        } else {
                           // $rootScope.ionicLoading(['scanning1', 'scanning']);
                            $rootScope.toast("QRCode gagal terbaca");
                        }; // output

                    },
                    function() {
                        $rootScope.toast("Gagal memindai gambar");
                    }
                );
            };
    };

})();