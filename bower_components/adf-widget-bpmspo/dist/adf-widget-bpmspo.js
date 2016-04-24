(function(window, undefined) {'use strict';


var app = angular.module('adf.widget.bpmspo', ['adf.provider'])
app.config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('bpmspo', {
        title: 'Pulse Oximeter',
        description: 'This widget shows your pulse and SPO2 concentration in real time',
        templateUrl: '{widgetsPath}/bpmspo/src/view.html',
        controller: 'bpmController',
        controllerAs: 'bpm',
        edit: {
          templateUrl: '{widgetsPath}/bpmspo/src/edit.html'
        }
      });
  }]);

app.factory('socket', function(){
  var socket = io.connect('http://127.0.1.1:3000')
  return socket;
});


app.controller('bpmController', ["$scope", "$interval", "socket", function($scope, $interval, socket){
  var bpm = this;

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

  socket.on('pulse data', function (data) {
    var arr = data.split('|');
    bpm.pulse = arr[0];
    bpm.spo2 = arr[1];
    $scope.$digest();
  });

}]);

angular.module("adf.widget.bpmspo").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/bpmspo/src/edit.html","<form role=form><div class=form-group></div></form>");
$templateCache.put("{widgetsPath}/bpmspo/src/view.html","<link href=../css-bpmspo/style.css rel=stylesheet><div><h1>Pulse Oximeter <img style=\"width:48px; height:48px; vertical-align:middle;\" class=objblink id=imgnow src=../images-bpmspo/heart_beat1.png alt=Heart></h1><div ng-controller=bpmController><h3>Pulse: {{bpm.pulse}}</h3><h3>SPO2: {{bpm.spo2}}</h3></div></div>");}]);})(window);