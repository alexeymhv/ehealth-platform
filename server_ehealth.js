/**
 * Created by aleksejs on 16.20.3.
 */
var http = require('http');
var url = require('url');
var fs = require('fs');
var io = require('socket.io', {forceNew: true});

//**Defining constant variables**//
var PATH_TO_OPENTSDB = "/home/aleksejs/opentsdb";
var ACCELEROMETER_DB_NAME = 'accelerometer.data';
var PULSOMETER_DB_NAME = 'pulsometer.data';

//**Initialising HBase Tables**//
InitHBaseTables(PATH_TO_OPENTSDB);

//**Initialising opentsdb socket**//
var createSocket = require( 'opentsdb-socket' );
var socket = createSocket();
socket.host( '127.0.0.1' );
socket.port( 4242 );
socket.connect();

var opentsdb = require( 'opentsdb' );
var dbClient = opentsdb.client();
dbClient.host('127.0.0.1');
dbClient.port( 4242 );

//**Initialising serialport**/
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var portName = '/dev/ttyACM0';

//**Initialising connection to opentsdb**//
//TODO Check if there is a connection to port
var connection = new SerialPort(portName, {
    baudRate:115200,
    parser:serialport.parsers.readline("\n")
});
//**************************************//

//**Initialising fft module**//
var fft = require('fft-js').fft;
var fftUtil = require('fft-js').util;

var rpmArray = new Array();
var rpmCounter = 0;
var time = 0;

//**Initialising array for pulse data**/
var bpmArray = new Array();
var bpmCounter = 0;

/**Launching Http Server**/
server = LaunchHTTPServer();
server.listen(3000, '127.0.1.1');
var listener = io.listen(server);

connection.on('open', function(){
    console.log("Connected...");
});

var wait = 0;

var seconds = 0;

var bpmTimer = 0;

var canstart = false;

var timerId = setInterval(function(){
    if(canstart) {
        seconds++;
        bpmTimer++;
    }
}, 1000);



connection.on('data', function(data){
    if(wait < 10)
        wait++;
    else{
        canstart = true;

        var pulseData = GetPulseDataArray(data)[0] + "|" + GetPulseDataArray(data)[1];

        rpmArray[rpmCounter] = parseFloat(GetPositionArray(data)[2]);
        bpmArray[bpmCounter] = GetPulseDataArray(data)[0];

        //console.log("Counter => " + rpmCounter);
        //console.log("Seconds => " + seconds + "\n");

        rpmCounter++;
        bpmCounter++;

        if(rpmCounter == 1024){
            rpmCounter = 0;

            seconds = 0;

            var phasors = fft(rpmArray);
            var frequencies = fftUtil.fftFreq(phasors, 73);
            var magnitudes = fftUtil.fftMag(phasors);
            var both = frequencies.map(function (f, ix) {
                return {frequency: f, magnitude: magnitudes[ix]};
            });

            //console.log(both);

            listener.sockets.emit('breathe data', both);
            rpmArray.length = 0;
        }

        if(bpmCounter == 73){
            bpmCounter = 0;
            var average_pulse = GetAverageValue(bpmArray);
            WritePulseToDB(average_pulse);
        }

        if(bpmTimer == 1){
            bpmTimer = 0;
            FetchPulseMetricsFromDB();
        }

        listener.sockets.emit('pulse data', pulseData);
    }
});

function CreateOpenTsdbTable(pathToOpenTSDB, tableName){
    //**Variables to execute shell script**//
    var exec = require('child_process').exec;

    //**It passes table name to the shell script stored in local directory.**//
    var command = "./scripts/create_opentsdb_metrics.sh " + pathToOpenTSDB + " " + tableName;
    exec(command);
}

//**Creating tables for different sensor's metrics**/
function InitHBaseTables(pathToOpenTSDB){
    CreateOpenTsdbTable(pathToOpenTSDB, ACCELEROMETER_DB_NAME);
    CreateOpenTsdbTable(pathToOpenTSDB, PULSOMETER_DB_NAME);
}

function GetPulseDataArray(data){
    var arr = data.split("|");
    var pulse = new Array(2);
    pulse[0] = arr[4];
    pulse[1] = arr[5];
    return pulse;
}

function GetAverageValue(valArr) {
    var average_value = 0
    for(var i=0; i<valArr.length; i++){
        average_value += parseFloat(valArr[i]);
    }
    average_value /= valArr.length;
    return parseFloat(average_value);
}

function GetPositionArray(data){
    var arr = data.split("|");
    var xyz = new Array(3);
    xyz[0] = arr[0];
    xyz[1] = arr[1];
    xyz[2] = arr[2];
    return xyz;
}

function WritePulseToDB(data) {
    console.log(data);
    var value = '';
    var now = require('date-now');

    value += 'put ';
    value += PULSOMETER_DB_NAME + ' ';
    value += parseInt(Date.now()) + ' ';
    value += parseFloat(data) + ' ';
    value += 'tag=pulse\n';

    socket.write(value, function ack() {
        console.log('...data written...');
    });
}

function WritePosToDB(data) {
    var value = '';
    var now = require('date-now');

    value += 'put ';
    value += ACCELEROMETER_DB_NAME + ' ';
    value += parseInt(Date.now()) + ' ';
    value += parseFloat(data[2]) + ' ';
    value += 'tag=axis_z\n';

    socket.write(value, function ack() {
        console.log('...data written...');
    });
}

function FetchPulseMetricsFromDB() {
    var valArr = new Array();

    var mQuery = opentsdb.mquery();
    mQuery.aggregator( 'none' );
    mQuery.tags( 'tag', 'pulse' );
    mQuery.metric( 'pulsometer.data' );

    var date = new Date();
    var current_time = parseInt(date.getTime()/1000);

    dbClient.start( convertTime(current_time-10) );
    console.log(convertTime(current_time-10))
    dbClient.end( convertTime(current_time) );
    console.log(convertTime(current_time))
    dbClient.queries(mQuery);

    dbClient.get( function onData(error, data){
        if(error){
            console.error(JSON.stringify(error));
            return;
        }
        else{
            for(i=0; i<data[0].dps.length; i++){
                valArr.push(data[0].dps[i][0].toString());
                valArr.push(data[0].dps[i][1].toString());
            }
            console.log(valArr.length);
            listener.sockets.emit('bpmchart data', valArr);
        }
    });

}

function convertTime(timestamp) {
    var date = new Date(timestamp * 1000);
    var tmpMonth = date.getMonth();
    if(parseInt(tmpMonth) < 9)
        var month = '0' + (tmpMonth+1);
    else
        var month = tmpMonth+1;

    var year = date.getFullYear();

    var tmpDay = date.getDate();
    if(parseInt(tmpDay) < 10)
        var day = '0' + tmpDay;
    else
        var day = tmpDay;

    var tmpHour = date.getHours();
    if(parseInt(tmpHour) < 10)
        var hour = '0' + tmpHour;
    else
        var hour = tmpHour;

    var tmpMinutes = date.getMinutes();
    if(parseInt(tmpMinutes) < 10)
        var minutes = '0' + tmpMinutes;
    else
        var minutes = tmpMinutes;

    var tmpSeconds = date.getSeconds();
    if(parseInt(tmpSeconds) < 10)
        var seconds = '0' + tmpSeconds;
    else
        var seconds = tmpSeconds;

    var newDate = year + '/' + month + '/' + day + '-' + hour + ':' + minutes + ':' + seconds;

    return newDate;
}

function LaunchHTTPServer() {
    var server = http.createServer(function(request, response){
        var path = url.parse(request.url).pathname;

        switch(path){
            case '/':
                response.writeHead(200, {'Content-Type':'text/html'});
                response.write('You are on your way to e-Health Platform');
                response.end();
                break;
            case '/index.html':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/html"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/pages/app.js':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/javascript"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/pages/stress-test.js':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/javascript"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/partials/stress-test.html':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/javascript"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/bootstrap/dist/css/bootstrap.css':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/css"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/angular-dashboard-framework/dist/angular-dashboard-framework.min.css':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/css"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/angular/angular.js':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/javascript"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/angular-route/angular-route.min.js':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/javascript"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/Sortable/Sortable.js':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/javascript"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/angular-bootstrap/ui-bootstrap.js':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/javascript"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/angular-bootstrap/ui-bootstrap-tpls.js':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/javascript"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/angular-dashboard-framework/dist/angular-dashboard-framework.js':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/javascript"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/adf-structures-base/dist/adf-structures-base.min.js':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/javascript"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/adf-widget-clock/dist/adf-widget-clock.min.css':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/css"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/moment/moment.js':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/javascript"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/adf-widget-clock/dist/adf-widget-clock.js':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/javascript"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/html"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/html"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/html"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/adf-widget-bpmspo/dist/adf-widget-bpmspo.min.js':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/html"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/adf-widget-rpm/dist/adf-widget-rpmsensor.min.js':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/html"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/adf-widget-bpmchart/dist/adf-widget-bpmchart.min.js':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/html"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/highcharts/adapters/standalone-framework.src.js':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/html"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/highcharts/highcharts.js':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/html"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/highcharts-ng/dist/highcharts-ng.js':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/html"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/bower_components/angular-local-storage/dist/angular-local-storage.min.js':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/html"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/css-bpmspo/style.css':
                fs.readFile(__dirname + "/bower_components/adf-widget-bpmspo" + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/css"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/images-bpmspo/heart_beat1.png':
                fs.readFile(__dirname + "/bower_components/adf-widget-bpmspo" + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/html"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            case '/images/cardiogram-main-title.png':
                fs.readFile(__dirname + path, function(error, data){
                    if(error){
                        response.writeHead(404);
                        response.write("The page doesn't exist - 404");
                        response.end;
                    }
                    else{
                        response.writeHead(200, {"Content-Type":"text/html"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            default:
                response.writeHead(404);
                response.write("The page doesn't exist - 404");
                response.end();
                break;

        }
    });

    return server;
}


