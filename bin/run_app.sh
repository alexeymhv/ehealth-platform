#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

node $DIR/../scripts/get_serialnumber.js
serialnumber=$(<$DIR/../conf/serialnumber)
echo $serialnumber

$DIR/run_container $serialnumber
