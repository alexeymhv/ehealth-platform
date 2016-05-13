#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


echo 'Starting OpenTSDB container...'
$DIR/run_opentsdb.sh
sleep 40s

echo 'Starting MySQL container...'
$DIR/run_mysqldb.sh
sleep 40s

echo 'Starting application container...'
$DIR/run_app.sh
