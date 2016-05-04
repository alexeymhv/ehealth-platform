app.controller('authCtrl',
    function ($scope, $rootScope, $routeParams, $location, $interval, socket, $http, toaster, webStorage) {
    //initially set those objects to null to avoid undefined error
    $scope.login = {};
    $scope.signup = {};

    $scope.doLogin = function (login) {
        if(CheckInput(login.serial) && CheckInput(login.password)){
            socket.emit('login', {serialNumber: login.serial, pass: login.password});
            toaster.pop('success', "Logging in...", "Please wait.\n\nWe are connecting to database...");
        }
        else
            toaster.pop('error', "Something gone wrong!", "Please input vaild credentials!");
    };
    
    $scope.doSignUp = function (signup) {
        if(CheckInput(signup.serialNumber) && CheckInput(signup.email)
            && CheckInput(signup.password) && CheckInput(signup.password2)
            && CheckInput(signup.name) && CheckInput(signup.surname)
            && CheckInput(signup.phone) && CheckInput(signup.address)){

            socket.emit('register',
                {
                    serialNumber: signup.serialNumber,
                    email: signup.email,
                    password: signup.password,
                    name: signup.name,
                    surname: signup.surname,
                    phone: signup.phone,
                    address: signup.address
            });
            toaster.pop('success', "Registering device!", "Please wait, we are registering your device!");
        }
        else
            toaster.pop('error', "Something gone wrong", "Please input valid data.");
    }

    $scope.doGetSerialNumber = function() {
        socket.emit('serialNumber', {data: 'Give me some Serial Number'});
    };

    socket.on('correct credentials', function(data){
        toaster.pop('success', "Successfully logged in!", "Welcome to e-Health dashboard!", 10000);
        webStorage.local.set('login', 'true');
        $location.path('/stress-test');
    });

    socket.on('wrong credentials', function(data){
        toaster.pop('error', "Authentication error!", "Device with such serial \nnumber and password doesn't exist", 10000);
    });

    socket.on('device registered', function(data){
        toaster.pop('success', "Device has been registered!", "Welcome to e-Health dashboard!", 10000);
        $location.path('/stress-test');
    });
    
    socket.on('device exists', function (data) {
        toaster.pop('error', "Registration error", "Device with such serial number already exists!", 10000);
    });
    
    socket.on('serial number', function (data) {
        $scope.login.serial = data.serialNumber;
        $scope.signup.serialNumber = data.serialNumber;
        $scope.$digest();
    });

    function CheckInput(data) {
        if(!data || 0 === data.length)
            return false;
        else if(!data|| /^\s*$/.test(data))
            return false;
        else
            return true;
    }
});
