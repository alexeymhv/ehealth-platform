/**
 * Created by aleksejs on 16.3.5.
 */

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var portName = '/dev/ttyUSB0';
var buffer_size = 256*17;
var connection = new SerialPort(portName, {baudrate: 57600},{buffersize: buffer_size});

var createSocket = require( 'opentsdb-socket' );
var socket = createSocket();
socket.host( '127.0.0.1' );
socket.port( 4242 );
socket.connect();

var counter=0;
var eeg_array = new Array();
var samplevalue = 0;

connection.on('open', function(){
    console.log("***Connected to serial port***");
});

connection.on('data', function(data) {
    if(counter < buffer_size){
        if (data.length > 0) {
            if( counter+data.length < buffer_size){
                for (i = 0; i < data.length; i++) {
                    eeg_array.push(data[i].toString());
                }
                counter+=data.length;
            }
            else{
                counter = buffer_size;
            }
        }
    }
    else{
        var tmp = 17;
        var idx = 0;
        var dataArr = new Array();

        for(z = 0; z< p.length; z++){
            if(eeg_array[z] == 90 && eeg_array[z+16] == 165){
                tmp = 0;
            }
            if(tmp < 17){
                process.stdout.write(eeg_array[z].toString() + " ");
                dataArr.push(eeg_array[z]);
            }
            tmp++;
            if(tmp == 17){
                process.stdout.write("\n");
            }
        }
        console.log("\n");

        var value  = '';
        var now = require('date-now');
        var counterTag = 0;

        for(i=3; i< dataArr.length; i+=17){
            samplevalue = ((dataArr[i] * 256) + (dataArr[i+1] -512)) * Math.pow(10, -3);
            console.log(samplevalue);
            value += 'put ';
            value += 'eeg.data ';
            value += parseInt(Date.now()/1000) + ' ';
            value += parseFloat(samplevalue) + ' ';
            value += 'tag=' + counterTag + '\n';
            counterTag++;

            socket.write( value, function ack() {
                value = '';
            });
        }

        counterTag = 0;
        console.log('EEG-SMT data was written to database');
        eeg_array.length = 0;

        dataArr.length = 0;
        counter = 0;
    }
});

