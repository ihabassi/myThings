var appControllers = angular.module('appControllers', []);

appControllers.controller('myCtrl', ['$scope', '$sce', '$timeout', '$interval', 'dataFactory', function ($scope, $sce, $timeout, $interval, dataFactory) {
    'use strict';

    // stores the image timer to cancel it when needed (used for image crossfade animation)
    var imageTimer;
    // stores the color timer to cancel it when needed
    var colorTimer;
    // stores the color events number fired at page load
    // since we are having two color events the database update won't fire
    // on the first two changes
    var colorEvents = 0;
    // for image ng-show
    $scope.currentimg = 0;
    // using this varialbe in the ng-model-options. it's the timeout we are waiting before updating the database after the input was updated
    $scope.updateDelay = 2000;
    $scope.productImages = ['http://mt-adserver.s3.amazonaws.com/Banners/Dynamic/Very.co.uk/winter2012new/images/img_25QS41X.jpg', 'http://mt-adserver.s3.amazonaws.com/Banners/Dynamic/Very.co.uk/winter2012new/images/img_254RX2E.jpg', 'http://mt-adserver.s3.amazonaws.com/Banners/Dynamic/Very.co.uk/winter2012new/images/img_243N21A.jpg'];

    $scope.getClickUrl = function (p_url) {
        return $sce.trustAsResourceUrl(p_url);
    };

    // dataFactory is the service that deals with getting or updating the data from or to the server
    dataFactory.dataGet()
        .success(function (response) {
            console.log(response);
            $scope.formData = response[0];
        });

    $scope.dataUpdate = function () {
        dataFactory.dataUpdate($scope.formData)
            .success(function (response) {
                console.log(response);
            });
    };

    // starts image crossfade animation
    var startFading = function () {
        // clear the timer
        if (imageTimer) {
            $interval.cancel(imageTimer);
        }

        // updates the timer
        function currentImageUpdate() {
            $scope.currentimg += 1;

            if ($scope.currentimg === $scope.productImages.length) {
                $scope.currentimg = 0;
            }
        }
        // set the image timer recursive function
        imageTimer = $interval(currentImageUpdate, 4000);
    };

    // update the color calling the dataUpdate to update the server
    var colorUpdate = function () {
        // clear the timer
        if (colorTimer) {
            // cancel the colorTimer to prevent multiple updating the server each time the user typing on the keyboard
            $timeout.cancel(colorTimer);
        }

        // using timeout to update the server only 2 seconds after the user fineshed typing
        colorTimer = $timeout(function () {
            $scope.dataUpdate();
        }, $scope.updateDelay);
    };

    // since we are using a color-picker it's not updating the input fields but the formData object (ng-model). that's why ngChange is not firing when we are picking a color.
    // So we are using $watch to watch the changes on the formData.priceColor property
    $scope.$watch('formData.priceColor', function (newvalue, oldvalue) {
        if (newvalue !== oldvalue) {
            // the if is to prevent updating the server on the first time the page is loaded
            if (colorEvents === 2) {
                colorUpdate();
            } else {
                colorEvents += 1;
            }
        }
    });

    // We are using $watch to watch the changes on the formData.titleColor property
    $scope.$watch('formData.titleColor', function (newvalue, oldvalue) {
        if (newvalue !== oldvalue) {
            // the if is to prevent updating the server on the first time the page is loaded
            if (colorEvents === 2) {
                colorUpdate();
            } else {
                colorEvents += 1;
            }
        }
    });

    startFading();
}]);