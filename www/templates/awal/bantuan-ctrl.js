(function() {

    'use strict';

    /**
     * @memberof starter
     * @ngdoc controller
     * @name bantuanCtrl
     * @param $scope {service} controller scope
     */

    angular.module('starter').controller('bantuanCtrl', ['$scope', bantuanCtrl]);

    function bantuanCtrl($scope) {
        /**
         * @property {Hash} vm collection og objects that belongs to this bantuan controller
         */
        var vm = this;

        $scope.toggle = false;

        /**
         * Add an object to the collection of group
         * @memberof bantuanCtrl
         * @function tampil
         */
        $scope.tampil = function() {
            if ($scope.toggle == false) {
                $scope.toggle = true;
            } else {
                $scope.toggle = false;
            }
        }

        $scope.toggle1 = false;

        /**
         * Add an object to the collection of group
         * @memberof bantuanCtrl
         * @function tampil1
         */
        $scope.tampil1 = function() {
            if ($scope.toggle1 == false) {
                $scope.toggle1 = true;
            } else {
                $scope.toggle1 = false;
            }
        }

        $scope.toggle2 = false;

        /**
         * Add an object to the collection of group
         * @memberof bantuanCtrl
         * @function tampil2
         */
        $scope.tampil2 = function() {
            if ($scope.toggle2 == false) {
                $scope.toggle2 = true;
            } else {
                $scope.toggle2 = false;
            }
        }

        $scope.toggle3 = false;

        /**
         * Add an object to the collection of group
         * @memberof bantuanCtrl
         * @function tampil3
         */
        $scope.tampil3 = function() {
            if ($scope.toggle3 == false) {
                $scope.toggle3 = true;
            } else {
                $scope.toggle3 = false;
            }
        }

    };

})();