#!/bin/bash

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
					wget -O /usr/tmp/arduino-1.6.9-linux32.tar.xz https://downloads.arduino.cc/arduino-1.6.9-linux32.tar.xz;
					tar -xJf /usr/tmp/arduino-1.6.9-linux32.tar.xz -C /opt/;
					rm -rf /usr/tmp/arduino-1.6.9-linux32.tar.xz
             			break;;
               			[2]* )
                                        mkdir /usr/tmp;
                                        wget -O /usr/tmp/arduino-1.6.9-linux64.tar.xz https://downloads.arduino.cc/arduino-1.6.9-linux64.tar.xz;
                                        tar -xJf /usr/tmp/arduino-1.6.9-linux64.tar.xz -C /opt/;
                                        rm -rf /usr/tmp/arduino-1.6.9-linux64.tar.xz
                		break;;
               			* ) echo 'Please answer y/n (yes or no)...';;
        		esac
                break;;
                [Nn]* )
                break;;
                * ) echo 'Please answer y/n (yes or no)...';;
        esac
done






