'use strict';

var app = angular.module('adf.widget.rpmaccel', ['adf.provider', 'highcharts-ng']);
app.config(function(dashboardProvider){
    dashboardProvider
      .widget('rpmaccel', {
        title: 'RPM Acceleration',
        description: 'This widget shows acceleration of you breath rate.',
        templateUrl: '{widgetsPath}/rpmaccel/src/view.html',
        controller: 'rpmacController',
        controllerAs: 'rpmacc',
        edit: {
          templateUrl: '{widgetsPath}/rpmaccel/src/edit.html'
        }
      });
});

app.factory('socket', function(){
  var socket = io.connect('http://127.0.1.1:3000')
  return socket;
});

app.controller('rpmacController', function($scope, $interval, socket) {
  var rpmacc = this;

  socket.emit('getRpmAccelData', {data: 'Give me some respiratory acceleration'});

  socket.on('rpmAcc data', function(rpmaccData) {
    var dataArray = new Array();

    for(var i=0;i<rpmaccData.length; i++){
      if(i%2 != 0) {
        var timestamp = parseInt(rpmaccData[i-1]/1000)*1000;
        dataArray.push({x: timestamp, y: parseFloat(rpmaccData[i])});
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
        text: 'Respiratory Acceleration Chart'
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 100
      },
      yAxis: {
        title: {
          text: 'Acceleration'
        },
        tickPixelInterval: 10,
        max: 1.05,
        min: 0.95
      },
      series: [{
        name: 'Acceleration / 5 min',
        data: dataArray
      }]
    };

    $scope.$digest();

  });

});
