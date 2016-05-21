#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

while true; do
        read -p 'Do you wish to install Docker on your system (required)? ' yn
        case $yn in
                [Yy]* ) curl -fsSL https://get.docker.com/ | sh;
                break;;
                [Nn]* )
                break;;
                * ) echo 'Please answer y/n (yes or no)...';;
        esac
done

while true; do
        read -p 'Do you wish to install MySQL Server on your system (required)? ' yn
        case $yn in
                [Yy]* ) apt-get update; apt-get -y install mysql-server;
                break;;
                [Nn]* )
                break;;
                * ) echo 'Please answer y/n (yes or no)...';;
        esac
done

while true; do
        read -p 'Do you wish to install Node.JS on your system (required)? ' yn
        case $yn in
                [Yy]* ) curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -;
                        apt-get install -y nodejs
                        apt-get install -y build-essential
			apt-get install -y nodejs-legacy
                break;;
                [Nn]* )
                break;;
                * ) echo 'Please answer y/n (yes or no)...';;
        esac
done

while true; do
        read -p 'Do you wish to install npm(Node.JS Package Manager) on your system? ' yn
        case $yn in
                [Yy]* ) apt-get install -y npm;
                break;;
                [Nn]* )
                break;;
                * ) echo 'Please answer y/n (yes or no)...';;
        esac
done

while true; do
        read -p 'Do you wish to install Serial Port module on your system (required)? ' yn
        case $yn in
                [Yy]* ) npm install serialport;
                break;;
                [Nn]* )
                break;;
                * ) echo 'Please answer y/n (yes or no)...';;
        esac
done

while true; do
        read -p 'Do you wish to install Arduino IDE module on your system (required)? ' yn
        case $yn in
                [Yy]* )
                                read -p 'Please specify your system build. [1] - x86 / [2] - x64 ' x
                                case $x in
                                [1]* )
                                        mkdir /usr/tmp;
                                        wget -O /usr/tmp/arduino-1.6.9-linux32.tgz http://arduino.googlecode.com/files/arduino-1.6.9-linux32.tgz;
                                        tar -xvf /usr/tmp/arduino-1.6.9-linux32.tgz -C /opt/;
                                        rm -rf /usr/tmp/arduino-1.6.9-linux32.tgz;
					
					mkdir /root/Arduino /root/Arduino/libraries;
                                        cp -r $DIR/arduino_sketchbooks/eHealth /root/Arduino/libraries/;
                                        cp -r $DIR/arduino_sketchbooks/PinChangeInt /root/Arduino/libraries/;
                                        cp -r $DIR/arduino_sketchbooks/MMA8452_Accelerometer /root/Arduino/libraries/;
                                        cp -r $DIR/arduino_sketchbooks/PulseAndBodyposition /root/Arduino/;
                                        /opt/arduino-1.6.9/arduino --port '/dev/ttyACM0'
                                        /opt/arduino-1.6.9/arduino --upload /root/Arduino/PulseAndBodyposition/PulseAndBodyposition.ino;
                                break;;
                                [2]* )
                                        mkdir /usr/tmp;
                                        wget -O /usr/tmp/arduino-1.6.9-linux64.tgz https://downloads.arduino.cc/arduino-1.6.9-linux64.tar.xz;
                                        tar -xvf /usr/tmp/arduino-1.6.9-linux64.tgz -C /opt/;
                                        rm -rf /usr/tmp/arduino-1.6.9-linux64.tgz;

                                        mkdir /root/Arduino /root/Arduino/libraries;
                                        cp -r $DIR/arduino_sketchbooks/eHealth /root/Arduino/libraries/;
                                        cp -r $DIR/arduino_sketchbooks/PinChangeInt /root/Arduino/libraries/;
                                        cp -r $DIR/arduino_sketchbooks/MMA8452_Accelerometer /root/Arduino/libraries/;
                                        cp -r $DIR/arduino_sketchbooks/PulseAndBodyposition /root/Arduino/;
                                        /opt/arduino-1.6.9/arduino --port '/dev/ttyACM0'
                                        /opt/arduino-1.6.9/arduino --upload /root/Arduino/PulseAndBodyposition/PulseAndBodyposition.ino;
                                break;;
                                * ) echo 'Please answer y/n (yes or no)...';;
                        esac
                break;;
                [Nn]* )
                break;;
                * ) echo 'Please answer y/n (yes or no)...';;
        esac
done

#Building up opentsdb container
echo 'Building up opentsdb container...'
$DIR/opentsdb_container/build

#Launching opentsdb container
echo 'Launching opentsdb container'
$DIR/opentsdb_container/run

echo 'Opentsdb is starting up...'
sleep 40s

echo 'Creating the necessary opentsdb metrics...'
docker exec -it opentsdb /opt/create_opentsdb_metrics.sh

#Building up mysql container
echo 'Building up mysql container...'
$DIR/mysql_container/build

#Stoping Local MySQL server
echo 'Stoping local mysql server...'
service mysql stop

#Launching mysql container
echo 'Launching mysql container...'
$DIR/mysql_container/run

echo 'MySQL server is starting up...'
sleep 40s

echo 'Creating the Ehealth Database'
$DIR/mysql_container/scripts/create-tables.sh

#Building up the ehealth application
echo 'Building e-health platform...'
$DIR/app_container/build

#Launching e-health application
echo 'Launching e-health platform...'
$DIR/bin/run_app.sh
