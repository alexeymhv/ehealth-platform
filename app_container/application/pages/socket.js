app.factory('socket', function(){
  var socket = io.connect('http://127.0.1.1:3000')
  return socket;
});