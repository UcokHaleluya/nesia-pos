(function() {
 
   'use strict';

   angular.module('starter').controller('kontakSalesCtrl', ['$cordovaCamera', '$ionicLoading', '$ionicPopup', '$state', '$http', '$filter', '$rootScope', '$scope', '$stateParams', kontakSalesCtrl]);

   function kontakSalesCtrl($cordovaCamera, $ionicLoading, $ionicPopup, $state, $http, $filter, $rootScope, $scope, $stateParams) {
      var vm = this;
      $scope.tgl_lahir;
      $scope.disabled = true;
      $scope.user_id = $stateParams;
      $scope.customer = {};
      $scope.sales = {};
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
		    if(!$rootScope.dataBusiness.logo) {
		      $rootScope.dataBusiness.logo = "img/logobisnis.png";
		    }
         // DATA ROLE
         $rootScope.dataRole = JSON.parse(localStorage.getItem("userInfo")).role; 

         $rootScope.http('contacts',{},
         function(response){
            if(response.success){
               angular.forEach(response.data.salesmen, function(value, key) {
                  // console.log(value.user_id);
                  if (value.user_id == Number($scope.user_id.id)) {
                     $scope.sales = response.data.salesmen[key];
                  }
               });

               var birth_date = $scope.sales.birth_date;
               $scope.sales.birth_date = new Date(birth_date.substr(0, 4), birth_date.substr(5, 2) - 1, birth_date.substr(8, 2));
               $scope.tanggal_lahir = $scope.sales.birth_date;
               var created_at = $scope.sales.created_at;
               $scope.sales.created_at = new Date(created_at.substr(0, 4), created_at.substr(5, 2) - 1, created_at.substr(8, 2));

               var img = $scope.sales.picture;
               $scope.sales.picture = "img/person.png";
               if (img != "" && img != null) {
                  $http({
                     method : "GET",
                     url : img,
                     headers :{
                        'contents': 'image/*'
                     }
                  }).then(function(response){
                     $scope.sales.picture = img;
                  });
               };

               $rootScope.http('sales-history/'+ $scope.sales.user_id,{},
                  function(response){
                     if(response.success){
                       $scope.histories = response.data.map(function(his){
                        his.tanggal = his.tanggal.split(' ')[0];
                        return his;
                       });

                     }else{
                        $rootScope.toast(response.message);
                     }
                  },
                  function(){
                     $rootScope.toast('Gagal terhubung ke server')
                  },
                  function(){
                     $rootScope.ionicLoadingHide();
                  }
               );  
            }else{
               $rootScope.toast(response.message);
            }
         },
         function(){
            $rootScope.toast('Gagal terhubung ke server');
         },
         function(){
            $rootScope.ionicLoadingHide();
         }
      );
      
            
      });

      console.log("$stateParams", $stateParams);


      // Ambil Foto admin
      $scope.ambilFotoSales = function() {
         $scope.data = {}

         var unggahFotoSalesPopup = $ionicPopup.show({

            template: 'Pilih sumber foto',
            title: 'Unggah foto Sales',
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

         unggahFotoSalesPopup.then(function(res) {
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
                     var image = document.getElementById('fotoSales');
                     image.src = "data:image/jpeg;base64," + imageData;

                     //Kirim semua data foto Admin
                     filePathFotoSales = imageData;
                  }, function(err) {});
               }, false);

            } else {

            }
         });
      }

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

      

      var filePathFotoSales = null;
      // Save
      $scope.save = function() {     
      if ($scope.disabled == false) {
         var birth_date = new Date();
         birth_date = $filter('date')($scope.sales.birth_date, 'yyyy-MM-dd');

         $rootScope.ionicLoading([]);

         // Data Profile
         if (filePathFotoSales == null) {
            var dataProfileSales = {
               token: $rootScope.dataUser.token,
               name: $scope.sales.name,
               birth_date: birth_date,
               email: $scope.sales.email,
               address: $scope.sales.address,
               mobile: $scope.sales.mobile,
               gender: $scope.sales.gender,
            }
         } else {
            var dataProfileSales = {
               token: $rootScope.dataUser.token,
               name: $scope.sales.name,
               birth_date: birth_date,
               email: $scope.sales.email,
               address: $scope.sales.address,
               mobile: $scope.sales.mobile,
               picture: "data:image/jpeg;base64," + filePathFotoSales,
               gender: $scope.sales.gender,
            }
         }         
         console.log('Data Profile Sales', dataProfileSales);
         $rootScope.http( "contact/save/" + $scope.sales.user_id, dataProfileSales,
            function(response){
               if (response.success) {
                  $rootScope.toast('Simpan Data Profil Sales berhasil');
                  localStorage.removeItem('contacts');
                  $state.go('pos.kontak');
               }else{
                  $rootScope.toast(response.message);
               }
            },
            function(){
               $rootScope.toast('Gagal terhubung ke server');
            },
            function(){
               $rootScope.ionicLoadingHide();
            }
         );
      
         // Data Bank
         var dataBankSales = {
            token: $rootScope.dataUser.token,
            bank: $scope.sales.banks[0].bank,
            branch: $scope.sales.banks[0].branch,
            account_name: $scope.sales.banks[0].account_name,
            account_no: $scope.sales.banks[0].account_no,
            remarks: $scope.sales.banks[0].remarks
         }

         console.log("Data Bank Sales", dataBankSales);
         $rootScope.http('user/bank/save/'+ $scope.sales.banks[0].id,dataBankSales,
            function(response){
               if (response.success){
                  $rootScope.toast('Simpan Data Bank Sales berhasil');
               }else{
                  $rootScope.toast(response.message);
               }
            },
            function(){
                $rootScope.toast('Gagal terhebung ke server');
            },
            function(){
               $rootScope.ionicLoadingHide();
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
      }
      };         
      $scope.$watch('tgl_lahir', function (dateString)
       {
           $scope.sales.birth_date = new Date(dateString);           
      });
       $scope.hapus = function(){
            var dataProfileSales = {
               active : false
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
                         $rootScope.http( "contact/save/" + $scope.sales.user_id, dataProfileSales,
                              function(response){
                                 if (response.success) {
                                    $rootScope.toast('Kontak berhasil di hapus');
                                    localStorage.removeItem('contacts');
                                    $state.go('pos.kontak');
                                 }else{
                                    $rootScope.toast(response.message);
                                 }
                              },
                              function(){
                                 $rootScope.toast('Gagal terhubung ke server');
                              },
                              function(){
                                 $rootScope.ionicLoadingHide();
                              }
                           );                   
                    }
                }]
            })
      };


   };

})();