(function() {

   'use strict';

   angular.module('starter').controller('kontakPenyediaCtrl', ['$cordovaCamera', '$ionicLoading', '$ionicPopup', '$state', '$http', '$filter', '$rootScope', '$scope', '$stateParams', kontakPenyediaCtrl]);

   function kontakPenyediaCtrl($cordovaCamera, $ionicLoading, $ionicPopup, $state, $http, $filter, $rootScope, $scope, $stateParams) {
      var vm = this;

      $scope.disabled = true;
      $scope.user_id = $stateParams;
      $scope.suppliers = {};
      $scope.tanggalMaks = new Date();
      $scope.tanggalMaks = $filter('date')($scope.tanggalMaks, 'yyyy-MM-dd');

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

         $rootScope.http('contacts', {},
            function(response) {
               if (response.success) {
                  var tmpS = response.data.suppliers;
                  for (var attr in tmpS) {
                     if (tmpS[attr].user_id == Number($scope.user_id.id)) {
                        $scope.suppliers = tmpS[attr];
                     }
                  }

                  var birth_date = $scope.suppliers.birth_date;
                  $scope.suppliers.birth_date = new Date(birth_date.substr(0, 4), birth_date.substr(5, 2) - 1, birth_date.substr(8, 2));

                  var created_at = $scope.suppliers.created_at;
                  $scope.suppliers.created_at = new Date(created_at.substr(0, 4), created_at.substr(5, 2) - 1, created_at.substr(8, 2));

                  var img = $scope.suppliers.picture;
                  $scope.suppliers.picture = "img/person.png";
                  if (img != "" && img != null) {
                     $http({
                        method: "GET",
                        url: img,
                        headers: {
                           'Content-Type': 'image/*'
                        }
                     }).then(function(response) {
                        $scope.suppliers.picture = img;
                     });
                  };
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
      };

      var filePathFotoPenyedia = null;
      // Ambil Foto admin
      $scope.ambilFotoPenyedia = function() {
         $scope.data = {}
         var unggahFotoPenyediaPopup = $ionicPopup.show({

            template: 'Pilih sumber foto',
            title: 'Unggah foto Penyedia',
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
         unggahFotoPenyediaPopup.then(function(res) {
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
                     var image = document.getElementById('fotoPenyedia');
                     image.src = "data:image/jpeg;base64," + imageData;

                     //Kirim semua data foto Admin
                     filePathFotoPenyedia = imageData;
                  }, function(err) {});
               }, false);

            } else {

            }
         });
      }


      // Save
      $scope.save = function() {
         if ($scope.disabled == false) {
            var birth_date = new Date();
            birth_date = $filter('date')($scope.suppliers.birth_date, 'yyyy-MM-dd');

            $rootScope.ionicLoading(['dataProfile', 'dataBankPenyedia']);
            // Data Profile
            if (filePathFotoPenyedia == null) {
               var dataProfilePenyedia = {
                  token: $rootScope.dataUser.token,
                  name: $scope.suppliers.name,
                  birth_date: birth_date,
                  email: $scope.suppliers.email,
                  address: $scope.suppliers.address,
                  mobile: $scope.suppliers.mobile,
                  gender: $scope.suppliers.gender
               }
            } else {
               var dataProfilePenyedia = {
                  token: $rootScope.dataUser.token,
                  name: $scope.suppliers.name,
                  birth_date: birth_date,
                  email: $scope.suppliers.email,
                  address: $scope.suppliers.address,
                  mobile: $scope.suppliers.mobile,
                  picture: "data:image/jpeg;base64," + filePathFotoPenyedia,
                  gender: $scope.suppliers.gender
               }
            }

            console.log('Data Profile Penyedia', dataProfilePenyedia);
            $rootScope.http("contact/save/" + $scope.suppliers.user_id, dataProfilePenyedia,
               function(response) {
                  if (response.success) {
                     $rootScope.toast('Simpan data berhasil');
                     localStorage.removeItem('contacts');
                      $state.go("pos.kontak");

                     // Data Bank

                     if ($scope.suppliers.banks.length > 0) {
                        var dataBankPenyedia = {
                        	user_id : $scope.suppliers.user_id,
                           bank: $scope.suppliers.banks[0].bank,
                           branch: $scope.suppliers.banks[0].branch,
                           account_name: $scope.suppliers.banks[0].account_name,
                           account_no: $scope.suppliers.banks[0].account_no,
                           remarks: $scope.suppliers.banks[0].remarks
                        }
                        console.log("Data Bank Penyedia", dataBankPenyedia);
                        $rootScope.http('user/bank/save' + ($scope.suppliers.banks[0].id ? '/' + $scope.suppliers.banks[0].id : ''), dataBankPenyedia,
                           function(response) {
                              if (response.success) {
                                 $rootScope.toast('Simpan data berhasil');
                              } else {
                                 $rootScope.toast(response.message);
                              }
                           },
                           function() {
                              $rootScope.toast('Gagal terhubung ke server');
                           },
                           function() {
                              $rootScope.ionicLoadingHide('dataBankPenyedia');
                           }
                        );
                     } else {
                        $rootScope.ionicLoadingHide('dataBankPenyedia');
                     };
                  } else {
                     $rootScope.toast(response.message);
                  }
               },
               function() {
                  $rootScope.toast('Gagal terhubung ke server');
               },
               function() {
                  $rootScope.ionicLoadingHide('dataProfile');
               }
            );

            // // Data Password
            //   var dataPassword = {
            //         token: $rootScope.dataUser.token,
            //         old_password: $scope.dataPassword.old_password,
            //         new_password: $scope.dataPassword.new_password,
            //         confirm_password: $scope.dataPassword.confirm_password,
            //         device: localStorage.getItem("deviceUUID")
            //   }

            //   $scope.dataPassword.old_password = undefined;
            //   $scope.dataPassword.new_password = undefined;
            //   $scope.dataPassword.confirm_password = undefined;

            //   console.log("Data Password", dataPassword);

            //   if(dataPassword.old_password != undefined || dataPassword.new_password != undefined || dataPassword.confirm_password != undefined) {
            //     $http({
            //         method: "POST",
            //         url: config.server + "user/change_password",
            //         data: dataPassword
            //     })
            //     .success(function(response) {
            //       console.log("Response Data Password", response);
            //       if(response.success)
            //         {

            //           $rootScope.ionicLoadingHide();

            //           localStorage.setItem("password", $scope.dataPassword.new_password);

            //           var alertPopup = $ionicPopup.alert({
            //             title: 'Pemberitahuan',
            //             template: 'Simpan Data Password berhasil!'
            //           });
            //           alertPopup.then(function(res) {
            //             $state.go($state.current, {}, {reload: true});
            //           });

            //         } 
            //       else 
            //         {

            //           $rootScope.ionicLoadingHide();
            //           var alertPopup = $ionicPopup.alert({
            //             title: 'Pemberitahuan',
            //             template: 'Password Anda salah!'
            //           });
            //           alertPopup.then(function(res) {
            //             $state.go($state.current, {}, {reload: true});
            //           });

            //         }
            //     })
            //     .error(function(){

            //       $rootScope.ionicLoadingHide();

            //       var alertPopup = $ionicPopup.alert({
            //         title: 'Pemberitahuan',
            //         template: 'Simpan Data Password gagal!'
            //       });
            //       alertPopup.then(function(res) {
            //         $state.go($state.current, {}, {reload: true});
            //       });
            //     });
            //   }
            //   else {

            //   }
         };
      };
      $scope.hapus = function() {
         var dataProfilePenyedia = {
            active: false
         }
         var myPopup = $ionicPopup.show({
            template: 'Apakah anda yakin ingin menghapus kontak?',
            title: 'Konfirmasi',
            scope: $scope,
            buttons: [{
               text: 'Batal',
               onTap: function(e) {}
            }, {
               text: 'Hapus',
               type: 'button-positive',
               onTap: function(e) {
                  $rootScope.http("contact/save/" + $scope.suppliers.user_id, dataProfilePenyedia,
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