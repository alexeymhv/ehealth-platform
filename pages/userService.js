app.factory('userService', [function(){
	var sdo = {
		isLogged: false,
		username: ''
	};
	return sdo;
}]);