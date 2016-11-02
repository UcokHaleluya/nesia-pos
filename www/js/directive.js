angular.module('starter').directive('appFilereader', function($q) {
    var slice = Array.prototype.slice;

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
                if (!ngModel) return;

                ngModel.$render = function() {};

                element.bind('change', function(e) {
                    var element = e.target;

                    $q.all(slice.call(element.files, 0).map(readFile))
                        .then(function(values) {
                            if (element.multiple) ngModel.$setViewValue(values);
                            else ngModel.$setViewValue(values.length ? values[0] : null);
                        });

                    function readFile(file) {
                        var deferred = $q.defer();

                        var reader = new FileReader();
                        reader.onload = function(e) {
                            deferred.resolve(e.target.result);
                        };
                        reader.onerror = function(e) {
                            deferred.reject(e);
                        };
                        reader.readAsDataURL(file);

                        return deferred.promise;
                    }

                }); //change

            } //link
    }; //return
});

angular.module('starter').directive('ctgChange', function() {
  return {
    restrict: 'A',
    require: '?ngChange',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
});


angular.module('starter').directive('format', function ($filter) {
        'use strict';

        return {
            require: '?ngModel',
            link: function (scope, elem, attrs, ctrl) {
                if (!ctrl) {
                    return;
                }

                ctrl.$formatters.unshift(function () {
                    return $filter('number')(ctrl.$modelValue);
                });

                ctrl.$parsers.unshift(function (viewValue) {
                    var plainNumber = viewValue.replace(/[\,\.]/g, ''),
                        b = $filter('number')(plainNumber);

                    elem.val(b);

                    return plainNumber;
                });
            }
        };
    })

angular.module('starter').directive('hideMenu', [function () {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            element.bind('click', function() {
                if ($(element).attr('data-show') == "true") {
                    $(element).attr('data-show', 'false');
                    $(attrs.child).slideUp();
                }else{
                    $(element).attr('data-show', 'true');
                    $(attrs.child).slideDown();    
                };


                $('.parent-menu').each(function(index, el) {
                    if ($(el).attr('data-child') != attrs.child) {
                        $(el).attr('data-show', 'false');
                        $($(el).attr('data-child')).slideUp();
                    };
                });
            });
        }
    };
}]);

angular.module('starter').filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
                    lastspace = lastspace - 1;
                }
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});

angular.module('starter').directive('clickTable', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('click', function(event) {
                var parent = $(element).parent();
                parent.find('tr.border').each(function(index, el) {
                    $(el).removeClass('border');
                });

                $(element).addClass('border');
            });
        }
    };
}])

angular.module('starter').directive('customValidate', [function () {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            element.bind('change', function(event) {
                var parent = $(element).parent();
                var valid = true;
                var val = $(element).val();
                var message = "";

                if ($(element).attr('required') == 'required') {
                    valid = !(val === "");
                    message = " tidak boleh kosong";
                };

                if (valid && $(element).attr('ng-minlength') != undefined) {
                    var length = parseInt($(element).attr('ng-minlength'));
                    valid = (length <= val.length);
                    message = " minimal " + length + " karakter";
                };

                if (valid && $(element).attr('match') != undefined) {
                    var matchVal = $($(element).attr('match')).val();
                    valid = (val === matchVal);
                    message = "";
                };

                if (valid && $(element).attr('pattern') != undefined) {
                    var pattern = new RegExp($(element).attr('pattern'));
                    valid = pattern.test(val);
                    message = " tidak valid";
                };

                if (!valid) {
                    $(element).attr('data-valid', false);
                    parent.find('.error').css('display', 'block');
                    parent.find('.error').html(attrs.title + message);
                }else{
                    $(element).attr('data-valid', true);
                    parent.find('.error').css('display', 'none');
                };
            });
        }
    };
}]);

angular.module('starter').directive('formValidate', [function () {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            element.bind('submit', function(event) {

                var valid = true;
                var submit = attrs.submit;
                $.each($(element).find('input, select, textarea'), function(index, item) {
                    var validItem = true;
                    var message = "";
                    var parent = $(item).parent();
                    var val = $(item).val();

                    if ($(item).attr('required') == 'required') {
                        validItem = !(val === "");
                        message = " tidak boleh kosong";
                    };

                    if (validItem && $(item).attr('ng-minlength') != undefined) {
                        var length = parseInt($(item).attr('ng-minlength'));
                        validItem = (length <= val.length);
                        message = " minimal " + length + " karakter";
                    };

                    if (validItem && $(item).attr('match') != undefined) {
                        var matchVal = $($(item).attr('match')).val();
                        validItem = (val === matchVal);
                        message = "";
                    };

                    if (validItem && $(item).attr('pattern') != undefined) {
                        var pattern = new RegExp($(item).attr('pattern'));
                        validItem = pattern.test(val);
                        message = " tidak valid";
                    };

                    if (!validItem) {
                        $(item).attr('data-valid', false);
                        parent.find('.error').css('display', 'block');
                        parent.find('.error').html($(item).attr('title') + message);
                    }else{
                        $(item).attr('data-valid', true);
                        parent.find('.error').css('display', 'none');
                    };

                    if (valid && !validItem) {
                        valid = validItem;
                    };
                });

                if (valid) {
                    // scope.parent
                    scope.$parent[submit]();
                }else{
                    return false;
                };
            });
        }
    };
}]);

angular.module('starter').filter('unique', function () {
    return function (items, filterOn) {
        if (filterOn === false) {
            return items;
        }
        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];
            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };
            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }
            });
            items = newItems;
        }
        return items;
    };
});

angular.module('starter').filter('startFrom', function() {
   return function(input, start) {
          if(input) {
              start = +start; //parse to int
              return input.slice(start);
          }
          return [];
      }
  })


angular.module('starter').directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

angular.module('starter').filter('slice', function() {
  return function(arr, start, end) {
    return arr.slice(start, end);
  };
});

angular.module("starter").filter("total", function() {
    return function(input, parameter, $scope) {
        if (!parameter) {
            return input;
        };
        var tmpFilter = [];
        var afterFilter = [];
        if (parameter || angular.isUndefined(parameter)) {
            angular.forEach(input, function(data){
            data = angular.copy(data);                               
                if (parameter.warehouse_id == data.warehouse_id) {
                    data.qty = parseFloat(data.qty);
                    if (tmpFilter.length == 0) {
                        tmpFilter.push(data);
                    }else{
                        var check = false;
                        for (var i = 0; i < tmpFilter.length; i++) {
                            if (tmpFilter[i].product_id == data.product_id) {
                                tmpFilter[i].qty += data.qty;
                                check = true;
                                break;
                            };
                        };

                        if (!check) {
                            tmpFilter.push(data);
                        };
                    };
                }//parameter
            });

            return tmpFilter;      
        } else {
            return input;
        };
    };
})

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