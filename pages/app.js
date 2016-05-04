/**
 * Created by aleksejs on 16.10.4.
 */

'use strict';

var app = angular.module('sample', ['adf', 'adf.structures.base', 'adf.widget.clock', 'adf.widget.bpmspo',
                          'adf.widget.rpmsensor', 'adf.widget.bpmchart', 'adf.widget.rpmaccel',
                          'adf.widget.gsr', 'adf.widget.eegsmt', 'LocalStorageModule',
                          'stress-test', 'ngRoute', 'ngAnimate', 'toaster']);
app.config(function (dashboardProvider, $routeProvider, localStorageServiceProvider) {
    dashboardProvider.widgetsPath('bower_components/');
    localStorageServiceProvider.setPrefix('adf');

    $routeProvider.
    when('/login', {
        title: 'Login',
        templateUrl: 'partials/login.html',
        controller: 'authCtrl'
    })
        .when('/signup', {
            title: 'Signup',
            templateUrl: 'partials/signup.html',
            controller: 'authCtrl'
        })
        .when('/stress-test',{
        templateUrl: 'partials/stress-test.html',
        controller: 'stressTestCtrl'
    })
    .otherwise({
        redirectTo: '/login'
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


//app.run(function ($rootScope, $location, Data) {
//    $rootScope.$on("$routeChangeStart", function (event, next, current) {
//        $rootScope.authenticated = false;
//        Data.get('session').then(function (results) {
//            if (results.uid) {
//                $rootScope.authenticated = true;
//                $rootScope.uid = results.uid;
//                $rootScope.name = results.name;
//                $rootScope.email = results.email;
//            } else {
//                var nextUrl = next.$$route.originalPath;
//                if (nextUrl == '/signup' || nextUrl == '/login') {
//
//                } else {
//                    $location.path("/login");
//                }
//            }
//        });
//    });
//});


