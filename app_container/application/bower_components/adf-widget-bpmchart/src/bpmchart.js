'use strict';

var app = angular.module('adf.widget.bpmchart', ['adf.provider', 'highcharts-ng']);
app.config(function(dashboardProvider){
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
});

app.factory('socket', function(){
  var socket = io.connect('http://127.0.1.1:3000')
  return socket;
});

app.controller('bpmchController', function($scope, $interval, socket) {
  var bpmch = this;

  socket.emit('getBpmChartData', {data: 'Give me some pulse chart'});

  socket.on('bpmchart data', function (brData) {
    var dataArray = new Array();

    for(var i=0;i<brData.length; i++){
      if(i%2 != 0) {
        var timestamp = parseInt(brData[i-1]/1000)*1000;
        dataArray.push({x: timestamp, y: parseFloat(brData[i])});
        console.log(timestamp);
      }
    }

    $scope.chartConfig = {
      options: {
        chart: {
          type: 'spline',
          animation: true,
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
        text: 'Pulse Chart'
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 100
      },
      yAxis: {
        title: {
          text: 'Pulse'
        },
        tickPixelInterval: 10,
        max: 90,
        min: 40
      },
      series: [{
        name: 'Pulse / 5 min',
        data: dataArray
      }]
    };

    $scope.$digest();

  });
});
