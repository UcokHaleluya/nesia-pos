(function () {

      'use strict';

      angular.module('starter').controller('tambahPenyediaCtrl', ['$state', '$http', '$cordovaCamera', '$ionicLoading', '$filter', '$ionicPopup', '$rootScope', '$scope', tambahPenyediaCtrl]);

      function tambahPenyediaCtrl($state, $http, $cordovaCamera, $ionicLoading, $filter, $ionicPopup, $rootScope, $scope){

          var vm = this;

		  var role_id = {};

		  $scope.tambahKontak = {};
		  var filePathFotoTambahKontak = null;
		  $scope.picture = "img/person.png";

		  $scope.tanggalMaks = new Date();
		  $scope.tanggalMaks = $filter('date')($scope.tanggalMaks, 'yyyy-MM-dd');

		  $scope.$on('$ionicView.enter', function() {

		    // SIMPAN SEMUA DATA USER
		    // DATA USER
		    $rootScope.dataUser = JSON.parse(localStorage.getItem("userInfo")).user;
		    // DATA BUSINESS
		    $rootScope.dataBusiness = JSON.parse(localStorage.getItem("userInfo")).business;
		    // Jika logo Bisnis kosong
				if(!$rootScope.dataBusiness.logo) {
		    	$rootScope.dataBusiness.logo = "img/logobisnis.png";
		    }

		    role_id = $rootScope.role_id;
		    console.log($rootScope.role_id);

		  });

		  $scope.ambilFotoKontak = function() {
		    $scope.data = {}

		    // Popup unggah foto kontak
		   var unggahFotoKontakPopup = $ionicPopup.show({
		      template: 'Pilih sumber foto',
		      title: 'Unggah foto kontak',
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

		   // Konfirmasi unggah foto kontak
		   unggahFotoKontakPopup.then(function(res) {
		   		// Konfirmasi OK
		      if (res) {
		        // alert($scope.data);
		        document.addEventListener("deviceready", function () {
		        var options = {
		        	// Parameter foto
		          quality: 100,
		          destinationType: Camera.DestinationType.DATA_URL,
		          sourceType: $scope.data,
		          allowEdit: true,
		          encodingType: Camera.EncodingType.JPEG,
		          targetWidth: 128,
		          targetHeight: 128,
		          popoverOptions: CameraPopoverOptions,
		          saveToPhotoAlbum: false,
		          correctOrientation:true
		        };

		        $cordovaCamera.getPicture(options).then(function(imageData) {
		          var image = document.getElementById('fotoKontak');
		          image.src = "data:image/jpeg;base64," + imageData;

		          //Kirim semua data foto kontak
		          filePathFotoTambahKontak = imageData;
		        }, function(err) {
		          });
		        }, false);

		      } 

		      // Konfirmasi Cancel
		      else {

		      }
		   });
		  };


	  	/**
	     * Tambah kontak
	     * @memberof kontakTambahCtrl
	     * @function add
	     */
		  $scope.add = function() {
		    // alert(role_id);
		    
		    // Ubah tanggal lahir jadi format tanggal
		    var birth_date = new Date();
		    birth_date = $filter('date')($scope.tambahKontak.birth_date, 'yyyy-MM-dd');

		    //var password = $scope.tambahKontak.password;
		    var password ;
		    // if($scope.tambahKontak.password == undefined) {
		    password = $scope.tambahKontak.name;
		    // }

		    // Loading tambah kontak
		    $rootScope.ionicLoading([]);

		    if(filePathFotoTambahKontak == null) {
		      var picture = null;
		    } else {
		      var picture = "data:image/jpeg;base64," + filePathFotoTambahKontak;
		    }


		    // Data yang dikirim ke server
		    var data = {
		          role_id: role_id,
		          user_id: $scope.tambahKontak.name.split(" ")[0].toLowerCase() + '@' + $rootScope.dataUser.id,
		          password: password,
		          picture: picture,

		          name: $scope.tambahKontak.name,
		          birth_date: birth_date,
		          mobile: $scope.tambahKontak.mobile,
		          email: $scope.tambahKontak.email,
		          gender: $scope.tambahKontak.gender,
		          address: $scope.tambahKontak.address,

		          bank: $scope.tambahKontak.bank,
		          bank_branch: $scope.tambahKontak.bank_branch,
		          bank_account_name: $scope.tambahKontak.bank_account_name,
		          bank_account_no: $scope.tambahKontak.bank_account_no,
		          bank_remarks: $scope.tambahKontak.bank_remarks,
		    }

		    // Cetak data yang dikirim ke server
		    console.log("Data Tambah Kontak", data);

		    // Pemanggilan AJAX

		   $rootScope.http("user/register", data,
			   	function(response){
			   		if (response.success){
			   				$rootScope.toast('Tambah kontak berhasil');
			   				localStorage.removeItem('contacts');
			   				$state.go('pos.kontak');
			   		}else{
			   				$rootScope.toast(response.message);
			   		}
			   	},function(){
			   		$rootScope.toast('Gagal terhubung ke server');
			   	},
			   	function(){
			   		 $rootScope.ionicLoadingHide();
			   	}
		   );


		    // Terhubung ke server
	    };

      };

})();