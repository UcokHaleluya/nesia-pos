(function() {
   'use strict';
   angular.module('starter').controller('kontakPelangganCtrl', ['$state', '$cordovaCamera', '$ionicLoading', '$ionicPopup', '$http', '$filter', '$rootScope', '$scope', '$stateParams', kontakPelangganCtrl]);

   function kontakPelangganCtrl($state, $cordovaCamera, $ionicLoading, $ionicPopup, $http, $filter, $rootScope, $scope, $stateParams) {
      /**
       * @property {Hash} vm collection og objects that belongs to this kontak pelanggan controller
       */
      var vm = this;
      $scope.disabled = true;
      $scope.user_id = $stateParams;      
      $scope.customer = {};
      $scope.tgl_lahir = new Date();
      // Set objek scope kelas 
      $scope.class = [{
         class: "",
         created_at: "",
         id: 0,
         is_current: 0,
         user_id: 0,
         value: 0
      }, {
         class: "Silver",
         created_at: "",
         id: 0,
         is_current: 1,
         user_id: 0,
         value: 0
      }, {
         class: "Gold",
         created_at: "",
         id: 0,
         is_current: 0,
         user_id: 0,
         value: 0
      }, {
         class: "Platinum",
         created_at: "",
         id: 0,
         is_current: 0,
         user_id: 0,
         value: 0
      }, {
         class: "Black",
         created_at: "",
         id: 0,
         is_current: 0,
         user_id: 0,
         value: 0
      }, ]
      $scope.dataSalesmen = [];
      $scope.idSalesTerpilih;
      $scope.badge = "silver";      
      $scope.$on('$ionicView.enter', function() {
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
         // RETRIEVE DATA TERBARU DARI SERVER
         // Cetak param id
         console.log("$stateParams", $stateParams);
         // Pemanggilan AJAX Pelanggan
         $rootScope.http('contacts/customer', {},
            function(response) {
               if (response.success) {
                  angular.forEach(response.data, function(value, key) {
                     if (value.user_id == Number($scope.user_id.id)) {
                        $scope.customer = response.data[key];
                     }
                  });
                  if ($scope.customer.class) {
                     angular.forEach($scope.customer.class, function(value, key) {
                        $scope.customer.class[key].value = Number($scope.customer.class[key].value);
                     });
                     //cek apakah kelas ada atau tidak
                     if ($scope.customer.class.length > 0) {
                        $scope.class = $scope.customer.class;
                     }
                  } else {
                     $scope.class = {
                        active: 'Silver',
                           value: {
                              silver: 0,
                              gold: 0,
                              platinum: 0,
                              black: 0
                           }
                     }
                  }
                  angular.forEach($scope.class, function(value, key) {
                     if (value.is_current == 1) {
                        $scope.badge = $scope.class[key].class.toLowerCase();
                     }
                  });
                  $rootScope.http('sales-history/' + $scope.customer.user_id, {},
                     function(response) {
                        if (response.success) {
                          $scope.histories = response.data.map(function(his){
                           his.tanggal = his.tanggal.split(' ')[0];
                           return his;
                          });
                        } else {
                           $rootScope.toast(response.message);
                        }
                     },
                     function() {
                        $rootScope.toast('Gagal terhubung ke server')
                     },
                     function() {
                        $rootScope.ionicLoadingHide();
                     }
                  );
                  // Set variabel tanggal lahir menjadi objek date.
                  var birth_date = $scope.customer.birth_date;
                  if ($scope.customer.birth_date != null && $scope.customer.birth_date != "")
                     $scope.customer.birth_date = new Date($scope.customer.birth_date);
                  else
                     $scope.customer.birth_date = new Date();
                  // Set variabel tanggal pembuatan menjadi objek date.
                  var created_at = $scope.customer.created_at;
                  $scope.customer.created_at = new Date(created_at.substr(0, 4), created_at.substr(5, 2) - 1, created_at.substr(8, 2));
                  $scope.tgl_lahir = $scope.customer.birth_date;
                  // Pemanggilan AJAX
                  if ($scope.customer.picture == null || $scope.customer.picture == "") {
                     $scope.customer.picture = "img/person.png";
                  } else {
                     $rootScope.ionicLoadingHide();
                     $rootScope.toast(response.message);
                  }
                  $scope.tanggal_lahir = $scope.customer.birth_date;
                  console.log($scope.customer);
               };
            },
            function() {
               $rootScope.ionicLoadingHide();
               $rootScope.toast("Gagal terhubung ke server");
            }
         );
         $rootScope.http('contacts/salesmen', {},
            function(response) {
               if (response.success) {
                  $scope.dataSalesmen = response.data;
               } else {
                  $rootScope.ionicLoadingHide();
                  $rootScope.toast(response.message);
               }
            },
            function() {
               $rootScope.ionicLoadingHide();
               $rootScope.toast("Gagal terhubung ke server");
            }
         );
      });
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
      var filePathFotoPelanggan = null;
      $scope.ambilFotoPelanggan = function() {
         $scope.data = {}
            // Popup pilih sumber foto
         var unggahFotoPelangganPopup = $ionicPopup.show({
            template: 'Pilih sumber foto',
            title: 'Unggah foto Pelanggan',
            subTitle: '',
            scope: $scope,
            buttons: [{
               text: '<i class="fa fa-camera-retro"></i><br/><b>KAMERA</b>',
               type: 'button-positive',
               onTap: function(e) {
                  return $scope.data = "1";
               }
            }, {
               text: '<i class="ion-images"></i><br/><b>GALERI</b>',
               type: 'button-positive',
               onTap: function(e) {
                  return $scope.data = "0";
               }
            }, ]
         });
         unggahFotoPelangganPopup.then(function(res) {
            if (res) {
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
                     var image = document.getElementById('fotoPelanggan');
                     image.src = "data:image/jpeg;base64," + imageData;                     
                     filePathFotoPelanggan = imageData;
                  }, function(err) {});
               }, false);
            } else {}
         });
      }   
      $scope.save = function() {
      console.log($scope.customer);   
      if ($scope.disabled == false) {
         var idKelasAktif, kelasAktif, valueKelasAktif;         
         if ($scope.class) {
            angular.forEach($scope.class, function(value, key) {
               if (value.is_current == 1) {
                  idKelasAktif = $scope.class[key].id;
                  kelasAktif = $scope.class[key].class;
                  valueKelasAktif = $scope.class[key].value;
               }
            });          
         } else {
            kelasAktif = "Silver";
            valueKelasAktif = 0;
         }        
         $rootScope.ionicLoading(['contact', '']);         
         if (filePathFotoPelanggan == null) {
            var dataProfilePelanggan = {
               token: $rootScope.dataUser.token,
               name: $scope.customer.name,
               birth_date: $scope.customer.birth_date,
               email: $scope.customer.email,
               address: $scope.customer.address,
               mobile: $scope.customer.mobile,
               gender: $scope.customer.gender,
               class: kelasAktif + ', Silver, Gold, Platinum, Black',
               class_value: valueKelasAktif + ', ' + $scope.class[1].value + ', ' + $scope.class[2].value + ', ' + $scope.class[3].value + ', ' + $scope.class[4].value,
            }
         } else {
            var dataProfilePelanggan = {
               token: $rootScope.dataUser.token,
               name: $scope.customer.name,
               birth_date: $scope.customer.birth_date,
               email: $scope.customer.email,
               address: $scope.customer.address,
               mobile: $scope.customer.mobile,
               picture: "data:image/jpeg;base64," + filePathFotoPelanggan,
               gender: $scope.customer.gender,
               class: kelasAktif + ', Silver, Gold, Platinum, Black',
               class_value: valueKelasAktif + ', ' + $scope.class[1].value + ', ' + $scope.class[2].value + ', ' + $scope.class[3].value + ', ' + $scope.class[4].value,
            }
         }
         // Cetak data profile pelanggan
         console.log('Data Profile Pelanggan', dataProfilePelanggan);
         // Pemanggilan AJAX Simpan Data Profile
         $rootScope.http("contact/save/" + $scope.customer.user_id, dataProfilePelanggan,
            function(response) {
               if (response.success == false) {
                  $rootScope.toast(response.message);
               } else {
                  $rootScope.toast("Data berhasil disimpan");
                  localStorage.removeItem('contacts');
                  $state.go("pos.kontak");
               }
            },
            function() {
               $rootScope.toast("Gagal terhubung ke server");
            },
            function() {
               $rootScope.ionicLoadingHide();
            }
         );
         if (idKelasAktif != null || idKelasAktif != undefined) {
            var param = {
               token: localStorage.getItem('token'),
               device: localStorage.getItem('deviceUUID')
            };
            $rootScope.http("class/active/" + idKelasAktif, {},
               function(response) {
                  if (response.success == false) {
                     $rootScope.ionicLoadingHide();
                     $rootScope.toast('Data berhasil disimpan')
                     $state.go("pos.kontak");
                  } else {
                     $rootScope.ionicLoadingHide();
                     $rootScope.toast(response.message);
                  }
               },
               function() {
                  $rootScope.ionicLoadingHide();
                  $rootScope.toast("Gagal terhubung ke server");
               }
            );
         }
         if ($scope.customer.salesman != null) {
            $rootScope.http("customer-salesman/" + $scope.customer.user_id, {
                  salesman_id: $scope.customer.salesman.user_id
               },
               function(response) {
                  console.log('Response Data Sales Pelanggan', response);
                  if (response.success) {
                     $scope.dataSalesmen = response.data;
                     $rootScope.ionicLoadingHide();
                     // Popup pesan respon
                     $rootScope.toast('Simpan Data Profile Pelanggan berhasil');
                  } else {
                     $rootScope.ionicLoadingHide();
                     $rootScope.toast(response.message);
                  }
               },
               function() {
                  $rootScope.ionicLoadingHide();
                  $rootScope.toast("Gagal terhubung ke server 2");
               }
            );
         };
         // Data Bank
         /*         if ($scope.customer.banks.length != 0) {
                     var dataBankPelanggan = {
                           bank: $scope.customer.banks[0].bank,
                           branch: $scope.customer.banks[0].branch,
                           account_name: $scope.customer.banks[0].account_name,
                           account_no: $scope.customer.banks[0].account_no,
                           remarks: $scope.customer.banks[0].remarks
                        }
                        // Cetak data bank pelanggan
                     console.log("Data Bank Pelanggan", dataBankPelanggan);
                     $rootScope.http('user/bank/save' + (($scope.customer.banks[0].id == undefined)? "": "/" + $scope.customer.banks[0].id), dataBankPelanggan,
                        function(response) {
                           console.log("Response Data Bank Pelanggan", response);
                           if (response.success) {
                              $rootScope.toast('Simpan Data Bank Pelanggan berhasil');
                                 $state.go("pos.kontak");
                           } else {
                              $rootScope.toast(response.message);
                           }
                        },
                        function() {
                           $rootScope.toast("Gagal terhubung ke server");
                        },
                        function(){
                             $rootScope.ionicLoadingHide();
                        }
                     );
                  } else {

                  }*/
               }
      };    
      
      $scope.hapus = function() {
         var dataProfilePelanggan = {
            active: false
         }
         var myPopup = $ionicPopup.show({
            template: 'Apakah anda yakin ingin menghapus kontak ?',
            title: 'Konfirmasi',
            scope: $scope,
            buttons: [{
               text: 'Batal',
               onTap: function(e) {}
            }, {
               text: 'Hapus',
               type: 'button-positive',
               onTap: function(e) {
                  $rootScope.http("contact/save/" + $scope.customer.user_id, dataProfilePelanggan,
                     function(response) {
                        if (response.success) {
                           $rootScope.toast('Kontak berhasil di hapus');
                           localStorage.removeItem('contacts');
                           $state.go('pos.kontak');
                        } else {
                           $rootScope.toast(response.message);
                        }
                     },
                     function() {
                        $rootScope.toast('Gagal terhubung ke server');
                     },
                     function() {
                        $rootScope.ionicLoadingHide();
                     }
                  );
               }
            }]
         })
      };
   };
})();