/**
 * Created by aleksejs on 16.10.4.
 */

'use strict';

var app = angular.module('sample', ['adf', 'adf.structures.base', 'adf.widget.clock', 'adf.widget.bpmspo',
                          'adf.widget.rpmsensor', 'adf.widget.bpmchart', 'adf.widget.rpmaccel',
                          'adf.widget.gsr', 'adf.widget.eegsmt', 'LocalStorageModule',
                          'stress-test', 'ngRoute', 'ngAnimate', 'toaster', 'webStorageModule']);
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
            title: 'Stress-test',
            templateUrl: 'partials/stress-test.html',
            controller: 'stressTestCtrl',
        })
    .otherwise({
        redirectTo: '/login'
    });
});


