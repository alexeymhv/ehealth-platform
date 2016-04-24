/**
 * Created by aleksejs on 16.10.4.
 */

'use strict';

var app = angular.module('sample', ['adf', 'adf.structures.base', 'adf.widget.clock', 'adf.widget.bpmspo',
                          'adf.widget.rpmsensor', 'adf.widget.bpmchart', 'LocalStorageModule', 'stress-test',
                          'ngRoute']);
app.config(function (dashboardProvider, $routeProvider, localStorageServiceProvider) {
    dashboardProvider.widgetsPath('bower_components/');
    localStorageServiceProvider.setPrefix('adf');

    $routeProvider.when('/ehealth-platform/stress-test',{
        templateUrl: 'partials/stress-test.html',
        controller: 'stressTestCtrl'
    })
    .otherwise({
        redirectTo: '/ehealth-platform/stress-test'
    });
});

app.controller('navigationCtrl', function($scope, $location) {

    $scope.navCollapsed = true;

    $scope.toogleNav = function(){
      $scope.navCollapsed = !$scope.navCollapsed;
    };

    $scope.$on('$routeChangeStart', function() {
        $scope.navCollapsed = true;
    });

    $scope.navClass = function (page) {
        var currentRoute = $location.path().substring(1) || 'Stress Test';
        return page == currentRoute || new RegExp(page).test(currentRoute) ? 'active' : '';
    };
});

