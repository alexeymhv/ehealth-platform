(function(window, undefined) {'use strict';


var app = angular.module('adf.widget.bpmchart', ['adf.provider', 'highcharts-ng']);
app.config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('bpmchart', {
        title: 'Pulse Chart',
        description: 'A chart of your pulse change in time',
        templateUrl: '{widgetsPath}/bpmchart/src/view.html',
        controller: 'bpmchController',
        controllerAs: 'bpmch',
        reload:true,
        edit: {
          templateUrl: '{widgetsPath}/bpmchart/src/edit.html'
        }
      });
}]);

app.factory('socket', function(){
  var socket = io.connect('http://127.0.1.1:3000')
  return socket;
});

app.controller('bpmchController', ["$scope", "$interval", "socket", function($scope, $interval, socket) {
  var bpmch = this;

  socket.on('bpmchart data', function (brData) {
    var dataArray = new Array();

    for(var i=0;i<brData.length; i++){
      if(i%2 != 0) {
        dataArray.push({x: brData[i-1], y: parseFloat(brData[i])});
        console.log(brData[i-1]);
      }
    }

    $scope.chartConfig = {
      options: {
        global: {
          useUTC: false
        },
        chart: {
          type: 'spline',
          animation: true,
          zoomType: 'x'
        },
        plotOptions: {
          spline: {
            marker: {
              enabled: false
            },
            animation: {
              duration: 0
            },
            lineColor: 'red'
          },
          series: {
            turboThreshold: 10000,
            animation: false
          }
        }
      },
      title: {
        text: 'Pulse Chart'
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 100,
      },
      yAxis: {
        title: {
          text: 'BPM'
        },
        tickPixelInterval: 10,
        max: 90,
        min: 40
      },
      series: [{
        name: 'BPM',
        data: dataArray
      }]
    };

    $scope.$digest();

  });
}]);

angular.module("adf.widget.bpmchart").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/bpmchart/src/edit.html","<form role=form><div class=form-group><label for=sample>Sample</label> <input type=text class=form-control id=sample ng-model=config.sample placeholder=\"Enter sample\"></div></form>");
$templateCache.put("{widgetsPath}/bpmchart/src/view.html","<div ng-controller=bpmchController><div ng-if=!chartConfig><h1>Loading...</h1></div><div ng-if=chartConfig><highchart id=chart1 config=chartConfig></highchart></div></div>");}]);})(window);