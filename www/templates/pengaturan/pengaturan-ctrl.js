(function() {

    'use strict';

    angular.module('starter').controller('pengaturanCtrl', ['$filter', '$cordovaCamera', '$rootScope', '$http', '$ionicPopup', '$state', '$ionicLoading', '$scope', pengaturanCtrl]);

    function pengaturanCtrl($filter, $cordovaCamera, $rootScope, $http, $ionicPopup, $state, $ionicLoading, $scope) {
        var vm = this;

        $scope.disabled = true;
        $scope.dataPassword = {};
        $scope.tanggalMaks = new Date();
        $scope.tanggalMaks = $filter('date')($scope.tanggalMaks, 'yyyy-MM-dd');


        //setting cash preferensi
        $scope.preferensi = {}
        $scope.preferensi.cashType = {
            'toko': 'Toko',
            'pilihan': 'Pilihan'
        };
 
        // User Info Update
        $scope.$on('$ionicView.enter', function() {
            //konversi      
            $scope.units = [];
            $scope.unit = {};
            // SIMPAN SEMUA DATA USER

            // DATA USER
            $rootScope.allDataUser = JSON.parse(localStorage.getItem("userInfo"));
            $rootScope.dataUser = JSON.parse(localStorage.getItem("userInfo")).user;

            var created_at = $scope.dataUser.created_at;
            $scope.dataUser.created_at = new Date(created_at.substr(0, 4), created_at.substr(5, 2) - 1, created_at.substr(8, 2));

            // DATA PROFILE
            $rootScope.dataProfile = JSON.parse(localStorage.getItem("userInfo")).profile;

            if ($scope.dataProfile.birth_date) {
                var birth_date = $scope.dataProfile.birth_date;
                $scope.dataProfile.birth_date = new Date($scope.dataProfile.birth_date);
            }

            // Jika foto Admin kosong
            if ($rootScope.dataProfile.picture) {
                $rootScope.dataProfile.picture = $rootScope.dataProfile.picture;
            } else {
                $rootScope.dataProfile.picture = "img/person.png";
            }

            // DATA BUSINESS
            $rootScope.dataBusiness = JSON.parse(localStorage.getItem("userInfo")).business;

            // Pemanggilan AJAX
            if ($rootScope.dataBusiness.logo == undefined || $rootScope.dataBusiness.logo == "") {
                $rootScope.dataBusiness.logo = "img/logobisnis.png";
            };

            // DATA ROLE
            $rootScope.dataRole = JSON.parse(localStorage.getItem("userInfo")).role;

            // DATA BANK
            $rootScope.dataBank = JSON.parse(localStorage.getItem("userInfo")).bank;
            if ($rootScope.dataBank == '') {
                $rootScope.url = config.server + "user/bank/save";
            } else {
                $rootScope.url = config.server + 'user/bank/save/' + $rootScope.dataBank[0].id;
            }

            //DATA ROLE
            if ($rootScope.dataRole.name == "admin") {
                $rootScope.dataRole.logo = "img/admin.png";
            } else {
                $rootScope.dataRole.logo = "img/gold.png"
            }

            //Pemanggilan Konversi
            $http({
                method: "POST",
                url: config.server + "user/setting/" + $rootScope.dataBusiness.id,
                data: {
                    'token': $rootScope.dataUser.token,
                    'device': localStorage.getItem("deviceUUID")
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }).success(function(response) {
                if (response.success) {
                    $scope.unitparents = response.data.units.master;
                    angular.forEach(response.data.units.user, function(value, key) {
                        var unit = {
                            id_unit: value.id_unit,
                            unit: value.unit,
                            conversion: value.conversion,
                            parent: value.parent,
                            parent_id: value.parent_id,
                            is_delete: 0
                        };
                        $scope.units.push(unit);
                    });

                    if ($scope.unitparents.length > 0) {
                        $scope.unit.parent = $scope.unitparents[0];
                    };

                    $scope.preferensi.data = response.data.preferensi;
                    localStorage.setItem("setting", JSON.stringify($scope.preferensi.data));
                    localStorage.setItem("default_tax", JSON.stringify($scope.preferensi.data.default_tax));
                    $scope.preferensi.data.use_warehouse = ($scope.preferensi.data.use_warehouse == 1) ? true : false;
                    //$scope.preferensi.data.use_warehouse = false;
                    if ($scope.preferensi.data.use_warehouse) {
                        $scope.preferensi.status = "aktif";
                    } else {
                        $scope.preferensi.status = "tidak aktif";
                    }
                };
            }).error(function() {
                $rootScope.toast("Gagal terhubung ke server");
            });
        });

        // Edit
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

        var filePathFotoAdmin = null;
        var filePathLogoBisnis = null;

        // Ambil Foto admin
        $scope.ambilFotoAdmin = function() {
            $scope.data = {}

            var unggahFotoAdminPopup = $ionicPopup.show({

                template: 'Pilih sumber foto',
                title: 'Unggah foto Admin',
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

            unggahFotoAdminPopup.then(function(res) {
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
                            var image = document.getElementById('fotoAdmin');
                            image.src = "data:image/jpeg;base64," + imageData;

                            //Kirim semua data foto Admin
                            filePathFotoAdmin = imageData;
                        }, function(err) {
                            $rootscope.toast("Gagal terhubung ke server");
                        });
                    }, false);

                } else {

                }
            });


        }

        // Ambil Logo bisnis
        $scope.ambilLogoBisnis = function() {
            $scope.data = {}

            var unggahLogoBisnisPopup = $ionicPopup.show({

                template: 'Pilih sumber foto',
                title: 'Unggah logo bisnis',
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

            unggahLogoBisnisPopup.then(function(res) {
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
                            var image = document.getElementById('logoBisnis');
                            image.src = "data:image/jpeg;base64," + imageData;
                            $rootScope.dataBusiness.logo = image.src;
                            $rootScope.dataBusiness.logo_change = true;
                            //Kirim semua data foto Admin
                        }, function(err) {
                            $rootscope.toast("Gagal terhubung ke server");
                        });
                    }, false);

                } else {

                }
            });

        }


        // Save
        $scope.save = function() {
            if ($scope.disabled == false) {
                var birth_date = new Date();
                birth_date = $filter('date')($scope.dataProfile.birth_date, 'yyyy-MM-dd');

                $rootScope.ionicLoading([]);
                // Data Profile
                if (filePathFotoAdmin == null) {
                    var dataProfile = {
                        name: $scope.dataProfile.name,
                        birth_date: $scope.dataProfile.birth_date,
                        email: $scope.dataProfile.email,
                        address: $scope.dataProfile.address,
                        phone: $scope.dataProfile.phone,
                        mobile: $scope.dataProfile.mobile,
                        gender: $scope.dataProfile.gender
                    }
                } else {
                    var dataProfile = {
                        name: $scope.dataProfile.name,
                        birth_date: $scope.dataProfile.birth_date,
                        email: $scope.dataProfile.email,
                        address: $scope.dataProfile.address,
                        phone: $scope.dataProfile.phone,
                        mobile: $scope.dataProfile.mobile,
                        gender: $scope.dataProfile.gender,
                        picture: "data:image/jpeg;base64," + filePathFotoAdmin,
                    }
                }

                console.log('Data Profile', dataProfile);

                $rootScope.http('user/change-profile', dataProfile,
                    function(response) { //success
                        if (response.success) {
                            $rootScope.dataProfile = response.data;
                            $rootScope.allDataUser.profile = response.data;
                            localStorage.setItem("userInfo", JSON.stringify($rootScope.allDataUser));
                            if ($rootScope.dataProfile.picture) {
                                $rootScope.dataProfile.picture = $rootScope.dataProfile.picture;
                            } else {
                                $rootScope.dataProfile.picture = "img/person.png";
                            }
                            // next send to other api
                            // send data business
                            // Data Business
                            if ($rootScope.dataBusiness.logo_change) {
                                var dataBusiness = {
                                    name: $scope.dataBusiness.name,
                                    phone: $scope.dataBusiness.phone,
                                    email: $scope.dataBusiness.email,
                                    address: $scope.dataBusiness.address,
                                    logo: $rootScope.dataBusiness.logo,
                                };
                            } else {
                                var dataBusiness = {
                                    name: $scope.dataBusiness.name,
                                    phone: $scope.dataBusiness.phone,
                                    email: $scope.dataBusiness.email,
                                    address: $scope.dataBusiness.address
                                };
                            }

                            console.log('Data Business', dataBusiness);
                            $rootScope.http('user/set-business', dataBusiness,
                                function(response) {
                                    if (response.success) {
                                        $rootScope.dataBusiness = response.data;
                                        $rootScope.allDataUser.business = response.data;
                                        localStorage.setItem("userInfo", JSON.stringify($rootScope.allDataUser));
                                        //next send to DataBank
                                        if ($rootScope.dataBusiness.logo == undefined || $rootScope.dataBusiness.logo == "") {
                                            $rootScope.dataBusiness.logo = "img/logobisnis.png";
                                        };

                                        if ($scope.dataBank.length > 0) {
                                            var dataBank = {
                                                bank: $scope.dataBank[0].bank,
                                                branch: $scope.dataBank[0].branch,
                                                account_name: $scope.dataBank[0].account_name,
                                                account_no: $scope.dataBank[0].account_no,
                                                remarks: $scope.dataBank[0].remarks
                                            }

                                            console.log("Response Data Bank", response);
                                            $rootScope.http('user/bank/save', dataBank,
                                                function(response) {
                                                    if (response.success) {
                                                        $rootScope.dataBank = response.data;
                                                        $rootScope.allDataUser.dataBank = response.data;
                                                        localStorage.setItem("userInfo", JSON.stringify($rootScope.allDataUser));
                                                        //make a new function
                                                        $scope.savePassword();
                                                    } else {
                                                        $rootScope.ionicLoadingHide();
                                                        $rootScope.toast(response.message);
                                                    }
                                                }
                                            );
                                        } else {
                                            /// call next func    
                                            $scope.savePassword()
                                        }

                                    } else {
                                        $rootScope.ionicLoadingHide();
                                        $rootScope.toast(response.message);
                                    }
                                },
                                function() { //error
                                    $rootScope.ionicLoadingHide();
                                    $rootScope.toast("Gagal terhubung ke server");
                                });

                        } else {
                            $rootScope.ionicLoadingHide();
                            $rootScope.toast(response.message);
                        }
                    },
                    function() { //error
                        $rootScope.ionicLoadingHide();
                    });
            }
        }


        //fungsi menyimpan password preferensi dan unit
        $scope.savePassword = function() {
            var dataPassword = {
                old_password: $scope.dataPassword.old_password,
                new_password: $scope.dataPassword.new_password,
                confirm_password: $scope.dataPassword.confirm_password
            }
            console.log("Data Password", dataPassword);

            if (dataPassword.old_password != undefined || dataPassword.new_password != undefined || dataPassword.confirm_password != undefined) {
                $rootScope.http('user/change_password', dataPassword,
                    function(response) {
                        if (response.success) {
                            // $rootScope.allDataUser.dataBank = response.data;
                            // localStorage.setItem("userInfo", JSON.stringify($rootScope.allDataUser));
                            $scope.dataPassword.old_password = undefined;
                            $scope.dataPassword.new_password = undefined;
                            $scope.dataPassword.confirm_password = undefined;

                            $rootScope.toast('Data Password berhasil');

                            $scope.saveUnit();
                        } else {
                            $rootScope.ionicLoadingHide();
                            $rootScope.toast('Password anda salah');

                        }
                    },
                    function() { //error password
                        $rootScope.ionicLoadingHide();
                        $rootscope.toast("Gagal terhubung ke server");

                    }
                );
            } else {
                $scope.saveUnit();
            };

        }

        $scope.bindDate = function(e){
            if (!e || e == null) {
                return "-";
            } else {
                var tgl = new Date(e);
                var dd = tgl.getDate();
                var mm = tgl.getMonth() + 1;
                var yy = tgl.getFullYear();
                var FullDate = dd + '/' + mm + '/' + yy;
                return FullDate;
            };            
        };

        $scope.saveUnit = function() {
            var settingsData = {
                'units': $scope.units,
                'preferensi': $scope.preferensi.data
            }
            console.log("Data unit", settingsData);

            $rootScope.http("user/setting/save/" + $rootScope.dataBusiness.id, settingsData,
                function(response) {
                    if (response.success) {
                        $scope.units = [];
                        angular.forEach(response.data.units.user, function(value, key) {
                            var unit = value;
                            unit.is_delete = 0;
                            $scope.units.push(unit);
                        });
                        localStorage.setItem("units", JSON.stringify($scope.units));
                        localStorage.setItem("setting", JSON.stringify(response.data.preferensi));
                        localStorage.setItem("default_tax", JSON.stringify(response.data.preferensi.default_tax));
                        $scope.toast('Data berhasil disimpan');
                    } else {
                        $rootScope.toast(response.message);
                    }
                },
                function() {
                    $rootscope.toast("Gagal terhubung ke server");
                },
                function() {
                    $rootScope.ionicLoadingHide();
                }
            );
            // console.log("Data unit", settingsData);
        }

        // Tema
        $scope.tema = function(theme) {  
            $rootScope.theme = theme;
            localStorage.setItem('theme', theme);
            
        }

        $scope.tambahkonversi = function() {
            var unitKonversi = false;
            angular.forEach($scope.units, function(item, index) {
                if ($scope.unit.unit.toUpperCase() == item.unit.toUpperCase() && $scope.unit.parent.id_unit == item.parent_id) {
                    unitKonversi = true;
                }
            });
            if (unitKonversi) {
                $rootScope.toast("Unit sudah ditambahkan");
            } else {
                if ($scope.unit.unit != undefined && $scope.unit.conversion != undefined) {
                    if ($scope.unit.id_unit == null || $scope.unit.id_unit == undefined) {
                        var unit = {
                            id_unit: -1,
                            parent_id: $scope.unit.parent.id_unit,
                            unit: $scope.unit.unit.toUpperCase(),
                            conversion: $scope.unit.conversion,
                            parent: $scope.unit.parent.unit,
                            is_delete: 0

                        };
                        $scope.units.push(unit);
                    }
                    $scope.unit.unit = null;
                    $scope.unit.conversion = null;
                    $scope.unit.id_unit = null;
                    $scope.unit.parent = $scope.unitparents[0];
                };
            };
        };

        $scope.hapuskonversi = function(obj) {
            /*$scope.units.splice(obj.index, 1);*/
            if ($scope.units[obj.index].is_delete === 1) {
                $scope.units[obj.index].is_delete = 0;
            } else {
                $scope.units[obj.index].is_delete = 1;
            }
        };

        $scope.editkonversi = function(obj) {
            $scope.unit.unit = obj.unit;
            $scope.unit.conversion = obj.conversion;
            $scope.unit.id_unit = obj.id_unit;

            for (var i = 0; i < $scope.unitparents.length; i++) {
                if ($scope.unitparents[i].id_unit == obj.parent_id) {
                    $scope.unit.parent = $scope.unitparents[i];
                    break;
                };
            };
        };

        $scope.changeOriantationLandspace = function() {
            var mypopup = $ionicPopup.show({

                template: 'Untuk mengganti orientasi harus keluar dulu',
                title: 'Ganti Orientasi',
                subTitle: '',
                scope: $scope,
                buttons: [{
                    text: 'Batal',
                    onTap: function(e) {}

                }, {
                    text: 'OK',
                    type: 'button-positive',
                    onTap: function(e) {
                        screen.lockOrientation('landscape');
                        localStorage.setItem('orientation', 'landscape');
                        ionic.Platform.exitApp();
                    }
                }, ]
            });
        };

        $scope.changeOriantationPortrait = function() {
         var mypopup = $ionicPopup.show({

                template: 'Untuk mengganti orientasi harus keluar dulu',
                title: 'Ganti Orientasi',
                subTitle: '',
                scope: $scope,
                buttons: [{
                    text: 'Batal',
                    onTap: function(e) {}

                }, {
                    text: 'OK',
                    type: 'button-positive',
                    onTap: function(e) {
                     screen.lockOrientation('portrait');
                     localStorage.setItem('orientation', 'portrait');
                        ionic.Platform.exitApp();
                    }
                }, ]
         });

        };

    };
})();