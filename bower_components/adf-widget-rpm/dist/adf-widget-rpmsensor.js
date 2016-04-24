(function(window, undefined) {'use strict';


var app = angular.module('adf.widget.rpmsensor', ['adf.provider', 'highcharts-ng']);
app.config(["dashboardProvider", function(dashboardProvider){
  dashboardProvider
    .widget('rpmsensor', {
      title: 'Respiratory Rate',
      description: 'This widget shows a chart of your breath rate',
      templateUrl: '{widgetsPath}/rpmsensor/src/view.html',
      controller: 'rpmController',
      controllerAs: 'rpm',
      reload:true,
      edit: {
        templateUrl: '{widgetsPath}/rpmsensor/src/edit.html'
      }
    });
}]);

app.factory('socket', function(){
  var socket = io.connect('http://127.0.1.1:3000')
  return socket;
});

app.controller('rpmController', ["$scope", "$interval", "socket", function($scope, $interval, socket){
  var rpm = this;

  //TODO - the breathe frequency should be changing dynamically
  rpm.frequency = "Loading...";

  //$scope.msgs = [];
  //
  //$scope.sendMsg = function(){
  //  socket.emit('send msg', $scope.msg.text);
  //};
  //
  //socket.on('get msg', function (data) {
  //  $scope.msgs.push(data);
  //  bpm.data = data;
  //  $scope.$digest();
  //})

  socket.on('breathe data', function (brData) {

    var dataArray = new Array();
    for(var i=1; i<brData.length; i++){
      dataArray.push({x: parseFloat(brData[i].frequency), y: parseFloat(brData[i].magnitude)});
    }

    //rpm.frequency = parseFloat((parseFloat(GetFrequency(brData))/60)) * 16;
    rpm.frequency = GetFrequency(brData);

    $scope.chartConfig = {
      options: {
        chart: {
          type: 'line',
          animation: false,
          zoomType: 'x'
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
        }
      },
      title: {
        text: 'Live RPM'
      },
      xAxis: {
        type: 'categories',
        tickPixelInterval: 100,
      },
      yAxis: {
        title: {
          text: 'Magnitude'
        },
        max:5,
        min:0
      },
      series:[{
        name: 'RPM',
        data: dataArray
      }]
    };


    $scope.$digest();
  });

  function GetFrequency(brData){
    var idx = 0;
    var max = 0

    for(var i=2; i<brData.length; i++){
      if(parseFloat(brData[i].frequency) > 10) {
        if(max == 0)
          max = parseFloat(brData[i-1].magnitude);
        if (parseFloat(brData[i].magnitude) > max) {
          max = parseFloat(brData[i].magnitude);
          idx = i;
        }
      }
    }

    return brData[idx].frequency;
  }

}]);

angular.module("adf.widget.rpmsensor").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/rpmsensor/src/edit.html","<form role=form><div class=form-group><label for=sample>Sample</label> <input type=text class=form-control id=sample ng-model=config.sample placeholder=\"Enter sample\"></div></form>");
$templateCache.put("{widgetsPath}/rpmsensor/src/view.html","<div ng-controller=rpmController><div ng-if=!chartConfig><h1>Loading...</h1></div><div ng-if=chartConfig><highchart id=chart1 config=chartConfig></highchart></div><div><h3>Frequency: {{rpm.frequency}}</h3></div></div>");}]);})(window);