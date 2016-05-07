#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker rm -f mysqldb
docker run --name mysqldb -v ~/application_data/ehealth/mysqldb:/var/lib/mysql --net=host -p 127.0.0.2:3306:3306 -e MYSQL_ROOT_PASSWORD=rootpass -d mysql
