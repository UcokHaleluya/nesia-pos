(function() {

    'use strict';

    /**
     * @memberof starter
     * @ngdoc controller
     * @name praPendaftaranCtrl
     * @param $rootScope {service} controller root scope
     * @param $scope {service} controller scope
     * @param $http {service} controller http
     * @param $ionicLoading {service} controller ionic loading
     * @param $state {service} controller state
     * @param $ionicHistory {service} controller ionic history
     * @param $ionicPopup {service} controller ionic popup
     */

    angular.module('starter').controller('praPendaftaranCtrl', ['$rootScope', '$scope', '$http', '$ionicLoading', '$state', '$timeout', '$ionicHistory', '$ionicSlideBoxDelegate', praPendaftaranCtrl]);

    function praPendaftaranCtrl($rootScope, $scope, $http, $ionicLoading, $state, $timeout, $ionicHistory, $ionicSlideBoxDelegate) {
        /**
         * @property {Hash} vm collection og objects that belongs to this login controller
         */
        var vm = this;

        $ionicHistory.nextViewOptions({
            disableBack: true

        });

          $scope.startApp =function(){
            $state.go('pos.menu-utama')
          }

          // Called each time the slide changes
          $scope.slideChanged = function(index) {
            $scope.slideIndex = index;
            console.log(index);
          };
    //});
    };

})();

