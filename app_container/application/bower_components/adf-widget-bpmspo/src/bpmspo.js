'use strict';

var app = angular.module('adf.widget.bpmspo', ['adf.provider'])
app.config(function(dashboardProvider){
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
  });

app.factory('socket', function(){
  var socket = io.connect('http://127.0.1.1:3000');

  return socket;
});


app.controller('bpmController', function($scope, $interval, socket){
  var bpm = this;

  socket.emit('getBpmSpoData', {data: 'Give me some pulse'});

  //socket.emit('getBpmSpoData', {hello: 'world'});

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

});
