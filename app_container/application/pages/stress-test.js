'use strict';

var app = angular.module('stress-test', ['adf', 'LocalStorageModule', 'webStorageModule']);

app.controller('stressTestCtrl', function($scope, $rootScope, $routeParams, $location,
                                          localStorageService, webStorage, socket){

    if(webStorage.get('login') == 'true'){

        var name = 'stress-test';
        var model = localStorageService.get(name);

        if(!model){
            model = {
                title: 'Stress Test',
                structure: '3-9',
                rows: [{
                    columns: [{
                        styleClass: "col-md-3",
                        widgets: [{
                            type: "bpmspo",
                            title: "Pulse Oximeter"
                        }, {
                            type: "clock",
                            title: "Clock",
                            config: {
                                timePattern: 'HH:mm:ss',
                                datePattern: 'YYYY-MM-DD'
                            }
                        }]
                    }, {
                        styleClass: "col-md-9",
                        widgets: [{
                            type: "rpmsensor",
                            title: "Respiratory Rate"
                        }, {
                            type: "bpmchart",
                            title: "Pulse Chart"
                        }]
                    }]
                }]
            }
        }

        $scope.name = name;
        $scope.model = model;
        $scope.collapsible = false;
        $scope.maximizable = false;

        $scope.user = webStorage.get('user_name') + ' ' + webStorage.get('user_surname');
        $scope.serial = webStorage.get('device_serialnumber');

        $scope.$on('adfDashboardChanged', function (event, name, model){
            localStorageService.set(name, model);
        });

        $scope.doLogout = function () {
            webStorage.set('login', 'false');
            socket.emit('logout', 'Stop sending data from serial port!')
            $location.path('/login');
        };
    }
    else{
        $location.path('/login');
    }
});