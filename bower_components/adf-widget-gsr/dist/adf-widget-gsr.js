(function(window, undefined) {'use strict';


var app = angular.module('adf.widget.gsr', ['adf.provider', 'highcharts-ng']);

app.config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('gsr', {
        title: 'Galvanic Skin Resistance',
        description: 'This widget shows the electrical resistance of your skin.',
        templateUrl: '{widgetsPath}/gsr/src/view.html',
        controller: 'gsrController',
        controllerAs: 'gsr',
        edit: {
          templateUrl: '{widgetsPath}/gsr/src/edit.html'
        }
    });
}]);

app.factory('socket', function(){
  var socket = io.connect('http://127.0.1.1:3000')
  return socket;
});

app.controller('gsrController', ["$scope", "$interval", "socket", function($scope, $interval, socket) {
  var gsr = this;

  socket.emit('getGsrData', {data: 'Give me some GSR'});

  socket.on('gsr data', function(gsrData) {
    var conductanceArray = new Array();
    var resistanceArray = new Array();

    for(var i=0; i<gsrData[0].length; i++) {
      if(i%2 != 0){
        var timestamp = parseInt(gsrData[0][i-1]/1000)*1000;
        conductanceArray.push({x: timestamp, y:parseFloat(gsrData[0][i])});
        resistanceArray.push({x: timestamp, y:parseFloat(gsrData[1][i])});
      }
    }

    $scope.chartConfig = {
      options: {
        chart: {
          animation: false,
          zoomType: 'x'
        },
        title: {
          text: 'Live GSR'
        },
        plotOptions: {
          line: {
            marker: {
              enabled: false
            },
            animation : {
              duration : 0
            }
          },
          series: {
            turboThreshold: 10000
          }
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 100,
        },
        yAxis: [{
            title: {
              text: 'Resistance'
            },
            opposite: true
          },
          {
            title: {
              text: 'Conductance'
            }
          }
        ]
      },
      series:[{
        name: 'Conductance / usV',
        yAxis: 1,
        type: 'line',
        data: conductanceArray
      }, {
        name: 'Resistance / kOhms',
        type: 'line',
        data: resistanceArray
      }]
    };

    $scope.$digest();

  });

}]);



angular.module("adf.widget.gsr").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/gsr/src/edit.html","<form role=form><div class=form-group><label for=sample>Sample</label> <input type=text class=form-control id=sample ng-model=config.sample placeholder=\"Enter sample\"></div></form>");
$templateCache.put("{widgetsPath}/gsr/src/view.html","<div ng-controller=gsrController><div ng-if=!chartConfig><h1>Loading...</h1></div><div ng-if=chartConfig><highchart id=chart1 config=chartConfig></highchart></div></div>");}]);})(window);