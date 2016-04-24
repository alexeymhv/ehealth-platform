(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(window, undefined) {'use strict';


var msg = 'Connecting to server...';
var counter = 0;

angular.module('adf.widget.bpmspo', ['adf.provider'])
  .config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('bpmspo', {
        title: 'Pulse',
        description: 'This widget shows your pulse and SPO2 concentration in real time',
        templateUrl: '{widgetsPath}/bpmspo/src/view.html',
        controller: 'bpmController',
        controllerAs: 'bpm',
        edit: {
          templateUrl: '{widgetsPath}/bpmspo/src/edit.html'
        }
      });
  }])
  .controller('bpmController', ["$scope", "$interval", "config", function($scope, $interval, config){
    var bpm = this;


    function setSomething(){
      var net = require('net');

      var server = net.createServer(function (socket) {
        console.log('Connected...');
        bpm.data = "It works!";
        //socket.write('Echo server\r\n');
        //socket.on('end', function(){
        //  console.log('Server disconnected...');
        //});
        //socket.on('data', function(data){
        //  console.log(data.toString());
        //});
      });

      server.listen(1337, '127.0.0.1');
    }

    var promise = $interval(setSomething, 1000);

    // cancel interval on scope destroy
    $scope.$on('$destroy', function(){
      $interval.cancel(promise);
    });
  }]);

angular.module("adf.widget.bpmspo").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/bpmspo/src/edit.html","<form role=form><div class=form-group><label for=sample>Sample</label> <input type=text class=form-control id=sample ng-model=config.sample placeholder=\"Enter sample\"></div></form>");
$templateCache.put("{widgetsPath}/bpmspo/src/view.html","<div><h1>Widget view</h1><p>Content of {{bpm.data}}</p></div>");}]);})(window);
},{"net":2}],2:[function(require,module,exports){

},{}]},{},[1]);
