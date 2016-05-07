#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

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
