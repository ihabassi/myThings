/* Services */
var appServices = angular.module('appServices', []);

appServices.factory('dataFactory', ['$http', function ($http) {
    'use strict';
    var dataFactory = {};
    var config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
    };

    dataFactory.dataUpdate = function (p_data) {
        var data = $.param(p_data);

        return $http.post('api/data_update.php', data, config);
    };

    dataFactory.dataGet = function () {
        var data = $.param({});

        return $http.get('api/data_get.php', data, config);
    };

    return dataFactory;
}]);