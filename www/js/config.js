// this file contains global configs for this app

var config = {
	// 'server' : 'http://pos-api.dev/'
	// 'server' : 'http://192.168.10.4:81/'		
	'server' : 'http://localhost:8080/pos-api/'
	//'server' : 'http://nesiagame.com/pos-api/',
	// 'server' : 'https://pos-nesiadev.rhcloud.com/'
	  // 'server' : 'http://pos-api.local/'
};

function ionicAlert ($ionicPopup, template) {
	var alertPopup = $ionicPopup.alert({
     	title: 'Error',
     	template: template
   	});

   	return alertPopup;
}