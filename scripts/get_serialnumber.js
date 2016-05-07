var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var portName = '/dev/ttyACM0';
var ARDUINO_SERIAL_NUMBER = "";
var PATH_TO_CONF_FILE = __dirname + '/../conf/serialnumber';

var fs = require('fs');

serialport.list(function (err, ports) {
    ports.forEach(function(port) {
        if(port.comName == portName){
        	ARDUINO_SERIAL_NUMBER = port.serialNumber;
		fs.writeFile(PATH_TO_CONF_FILE, ARDUINO_SERIAL_NUMBER, function(err) {
			if(err) {
				return console.log(err);	
			}
			process.exit();
		});
		//process.exit();
 	}
            //ARDUINO_SERIAL_NUMBER = port.serialNumber;
	    //console.log(ARDUINO_SERIAL_NUMBER);

    });
});

var connection = new SerialPort(portName, {
    baudRate:115200,
    parser:serialport.parsers.readline("\n")
});
