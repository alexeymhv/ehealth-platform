(function(window, undefined) {'use strict';


var app = angular.module('adf.widget.eegsmt', ['adf.provider', 'highcharts-ng']);
app.config(["dashboardProvider", function(dashboardProvider){
  dashboardProvider
    .widget('eegsmt', {
      title: 'EEG-SMT Live',
      description: 'This widget shows your brainwave activity.',
      templateUrl: '{widgetsPath}/eegsmt/src/view.html',
      controller: 'eegSmtController',
      controllerAs: 'eegSmtCtrl',
      reload:true,
      edit: {
        templateUrl: '{widgetsPath}/eegsmt/src/edit.html'
      }
    });
}]);

app.factory('socket', function(){
  var socket = io.connect('http://127.0.1.1:3000')
  return socket;
});

app.controller('eegSmtController', ["$scope", "$interval", "socket", function($scope, $interval, socket) {
  var bpmch = this;

  socket.emit('getEegSmtData', {data: 'Give me some EEG'});

  socket.on('eegsmt data', function (eegSmtData) {
    var dataArray = new Array();

    for(var i=0;i<eegSmtData.length; i++){
      if(i%2 != 0) {
        var timestamp = parseInt(eegSmtData[i-1]/1000)*1000;
        dataArray.push({x: timestamp, y: parseFloat(eegSmtData[i])});
      }
    }

    $scope.chartConfig = {
      options: {
        chart: {
          type: 'line',
          animation: false,
          zoomType: 'x',
          renderTo: 'container'
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
      global: {
        useUTC: false
      },
      title: {
        text: 'Live EEG-SMT data'
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 100
      },
      yAxis: {
        title: {
          text: 'Volts'
        },
        tickPixelInterval: 10,
        max: 0.6,
        min: -0.6
      },
      series: [{
        name: 'EEG-SMT',
        data: dataArray
      }]
    };

    $scope.$digest();

  });
}]);

angular.module("adf.widget.eegsmt").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/eegsmt/src/edit.html","<form role=form><div class=form-group><label for=sample>Sample</label> <input type=text class=form-control id=sample ng-model=config.sample placeholder=\"Enter sample\"></div></form>");
$templateCache.put("{widgetsPath}/eegsmt/src/view.html","<div ng-controller=eegSmtController><div ng-if=!chartConfig><h1>Loading...</h1></div><div ng-if=chartConfig><highchart id=chart1 config=chartConfig></highchart></div></div>");}]);})(window);