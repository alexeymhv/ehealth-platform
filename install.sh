#!/bin/bash

apt-get update
apt-get upgrade

#Installing nodejs and npm
curl -sL https://deb.nodesource.com/setup | sudo bash -
apt-get install nodejs
apt-get install build-essential
npm install npm -g
