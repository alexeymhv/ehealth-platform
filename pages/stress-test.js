'use strict';

var app = angular.module('stress-test', ['adf', 'LocalStorageModule', 'webStorageModule']);

app.controller('stressTestCtrl', function($scope, localStorageService, webStorage){
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

    $scope.$on('adfDashboardChanged', function (event, name, model){
       localStorageService.set(name, model);
    });
});
