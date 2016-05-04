app.controller('authCtrl', function ($scope, $rootScope, $routeParams, $location, $interval, socket) {
    //initially set those objects to null to avoid undefined error
    $scope.login = {};
    $scope.signup = {};

    $scope.doLogin = function (login) {
        if(CheckInput(login.serial) && CheckInput(login.password)){
            socket.emit('login', {serialNumber: login.serial, pass: login.password});
            console.log(login.serial + " " + login.password);
        }
    };

    $scope.doGetSerialNumber = function() {
        socket.emit('serialNumber', {data: 'Give me some Serial Number'});
    };

    socket.on('correct credentials', function(data){
        $location.path('/stress-test');
    });
    
    socket.on('serial number', function (data) {
        $scope.login.serial = data.serialNumber;
        $scope.signup.serialNumber = data.serialNumber;
        $scope.$digest();
    })

    function CheckInput(data) {
        if(!data || 0 === data.length)
            return false;
        else if(!data|| /^\s*$/.test(data))
            return false;
        else
            return true;
    }


    //$scope.signup = {email:'',password:'',name:'',phone:'',address:''};
    //$scope.signUp = function (customer) {
    //    Data.post('signUp', {
    //        customer: customer
    //    }).then(function (results) {
    //        Data.toast(results);
    //        if (results.status == "success") {
    //            $location.path('stress-test');
    //        }
    //    });
    //};
    //$scope.logout = function () {
    //    Data.get('logout').then(function (results) {
    //        Data.toast(results);
    //        $location.path('login');
    //    });
    //}
});
