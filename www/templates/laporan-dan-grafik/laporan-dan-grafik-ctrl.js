(function() {

    'use strict';

    /**
     * @memberof starter
     * @ngdoc controller
     * @name laporanDanGrafikCtrl
     * @param $rootScope {service} controller root scope
     * @param $scope {service} controller scope
     */

    angular.module('starter').controller('laporanDanGrafikCtrl', ['$rootScope', '$scope', laporanDanGrafikCtrl]);

    function laporanDanGrafikCtrl($rootScope, $scope) {
        /**
         * @property {Hash} vm collection og objects that belongs to this laporan dan grafik controller
         */
        var vm = this;

        /**
         * Menjalankan parameter ketika ui tampil
         * @memberof laporanDanGrafikCtrl
         * @function $scope.$on
         * @$ionicView.enter {Service} memasuki ui
         */
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
            if (!$rootScope.dataBusiness.logo) {
                $rootScope.dataBusiness.logo = "img/logobisnis.png";
            }
            // DATA ROLE
            $rootScope.dataRole = JSON.parse(localStorage.getItem("userInfo")).role;

            $scope.data.table.from_date = new Date();
            $scope.data.table.to_date = new Date();
            $scope.data.table.order = "desc";

            $scope.data.chart.from_date = new Date();
            $scope.data.chart.to_date = new Date();
            $scope.data.chart.order = "desc";

            $scope.data.reports = [];
            if ($rootScope.businesstype =='pro') {
            $scope.data.reports.push({value: "warehouse", text : "Penjualan per toko"});              
            $scope.data.reports.push({value: "customer_t", text : "Penjualan per pelanggan(transaksi)"});
            $scope.data.reports.push({value: "customer_n", text : "Penjualan per pelanggan(nominal)"});
          
                if ($rootScope.dataRole.name != "salesman") {
                    $scope.data.reports.push({value: "salesman", text : "Penjualan salesman"});
                };
            }
              // $scope.data.reports.push({value: "laporan", text : "laporan harian"});           
              $scope.data.reports.push({value: "product", text : "Penjualan per produk(transaksi)"});
              $scope.data.reports.push({value: "product_n", text : "Penjualan per produk(nominal)"});
            $scope.data.reports.push({value: "product_l", text : "Laporan per produk(Kuantitas)"});

            $scope.table = {};
            $scope.chart = {};

        });
    

        
        // Chart

        $scope.labels = ["3 Nov", "4 Nov", "5 Nov", "6 Nov", "7 Nov"];
        $scope.series = ['Series A', 'Series B'];
        $scope.dataChart = [
            [2, 13, 8, 4, 1, 8, 3],
            [15, 6, 18, 11, 12, 9, 7]
        ];

        $scope.data = {};
        $scope.data.table = {};
        $scope.data.chart = {};
        $scope.table = {};
        $scope.chart = {};
        $scope.data.reports = [];

        $scope.options = {
           // xAxis: [
           //    axisLabel: 'X Axis',
           //    rotateLabels: -90
           //   ]
        };

        $scope.tampilkanTable = function() {
            if (!$scope.data.table.jenis_laporan) {
                $rootScope.toast("Silahkan pilih Jenis laporan");
                return false;
            }
            $rootScope.ionicLoading([]);
            var url = "sales-report/";
            var sortby = "amount";
            if ($scope.data.table.jenis_laporan == "customer_n") {
                url += "customer/";
                sortby = "amount";
            }else if($scope.data.table.jenis_laporan == "customer_t"){
                url += "customer/";
                sortby = "count";
            }else if($scope.data.table.jenis_laporan == "product"){
                url += $scope.data.table.jenis_laporan + "/";
                sortby = "count";
            }else if($scope.data.table.jenis_laporan == "product_n"){
                url += "product/";
                sortby = "amount";
            }else{
                url += $scope.data.table.jenis_laporan + "/";
            };

            url += $scope.data.table.order + "/" + sortby;

            $rootScope.http(url, $scope.data.table,
                function(response) {
                    if (response.success) {
                        $scope.table.lists = response.data.table;
                    };
                },
                function() {
                    $rootScope.toast('Gagal terhubung ke server');
                },
                function() {
                    $rootScope.ionicLoadingHide();
                    $scope.table.jenis_laporan = $scope.data.table.jenis_laporan;
                }
            );
        };


        $scope.tampilkanChart = function() {
            if (!$scope.data.chart.jenis_laporan) {
                $rootScope.toast("Silahkan pilih Jenis laporan");
                return false;
            }
            $rootScope.ionicLoading([]);
            var url = "sales-report/";
            var sortby = "amount";
            if ($scope.data.chart.jenis_laporan == "customer_n") {
                url += "customer/";
                sortby = "amount";
            }else if($scope.data.chart.jenis_laporan == "customer_t"){
                url += "customer/";
                sortby = "count";
            }else if($scope.data.chart.jenis_laporan == "product"){
                url += $scope.data.chart.jenis_laporan + "/";
                sortby = "count";
            }else if($scope.data.chart.jenis_laporan == "product_n"){
                url += "product/";
                sortby = "amount";
            }else{
                url += $scope.data.chart.jenis_laporan + "/";
            };

            url += $scope.data.chart.order + "/" + sortby;

            $rootScope.http(url, $scope.data.chart,
                function(response) {
                    if (response.success) {
                        $scope.chart.data = [response.data.chart.data];
                        $scope.chart.labels = response.data.chart.label;
                    };
                },
                function() {
                    $rootScope.toast('Gagal terhubung ke server');
                },
                function() {
                    $rootScope.ionicLoadingHide();
                    $scope.chart.jenis_laporan = $scope.data.chart.jenis_laporan;
                }
            );
        };

    };

})();