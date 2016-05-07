#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

MYSQL_HOST_IP='127.0.0.2'
MYSQL_ROOT_USER='root'
MYSQL_ROOT_PASSWORD='rootpass'

mysql -h $MYSQL_HOST_IP -u$MYSQL_ROOT_USER -p$MYSQL_ROOT_PASSWORD < $DIR/create_user_table.sql
