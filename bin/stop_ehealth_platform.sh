#!/bin/bash

echo 'Stopping OpenTSDB container...'
docker rm -f opentsdb

echo 'Stopping MySQL container...'
docker rm -f mysqldb

echo 'Stopping application container...'
docker rm -f ehealth_platform
