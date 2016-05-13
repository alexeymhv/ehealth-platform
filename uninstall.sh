#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

while true; do
        read -p 'Do you wish to uninstall Docker from your system? ' yn
        case $yn in
                [Yy]* ) apt-get purge docker-engine;
			apt-get autoremove --purge docker-engine;
			while true; do
			        read -p 'Do you wish to remove Docker images from your system? ' yn
        			case $yn in
                			[Yy]* ) rm -rf /var/lib/docker;
                		break;;
                		[Nn]* )
                		break;;
                		* ) echo 'Please answer y/n (yes or no)...';;
        			esac
			done
			while true; do
                                read -p 'Do you wish to remove application data from your system? ' yn
                                case $yn in
                                        [Yy]* ) rm -rf /root/application_data;
                                break;; 
                                [Nn]* )
                                break;;
                                * ) echo 'Please answer y/n (yes or no)...';;
                                esac
                        done
                break;;
                [Nn]* )
                break;;
                * ) echo 'Please answer y/n (yes or no)...';;
        esac
done

while true; do
        read -p 'Do you wish to uninstall MySQL server from on your system? ' yn
        case $yn in
                [Yy]* ) sudo apt-get --purge remove mysql-client mysql-server mysql-common;
			sudo apt-get autoremove;
                break;;
                [Nn]* )
                break;;
                * ) echo 'Please answer y/n (yes or no)...';;
        esac
done

while true; do
        read -p 'Do you wish to uninstall Node.JS from your system? ' yn
        case $yn in
                [Yy]* ) apt-get remove nodejs;
			apt-get remove npm;
                break;;
                [Nn]* )
                break;;
                * ) echo 'Please answer y/n (yes or no)...';;
        esac
done

while true; do
        read -p 'Do you wish to uninstall Arduino IDE from your system? ' yn
        case $yn in
                [Yy]* ) rm -rf /opt/arduino-1.6.9;
			rm -rf /root/Arduino;
                break;;
                [Nn]* )
                break;;
                * ) echo 'Please answer y/n (yes or no)...';;
        esac
done

