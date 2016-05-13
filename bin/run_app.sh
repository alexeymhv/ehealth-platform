#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

node $DIR/../scripts/get_serialnumber.js
serialnumber=$(<$DIR/../conf/serialnumber)
echo $serialnumber

docker rm -f ehealth_platform
docker run --name ehealth_platform --net=host -it --privileged -d -p 127.0.1.1:3000:3000 -v /dev/ttyACM0:/dev/ttyACM0 -e "ARDUINO_SERIAL_NUMBER=$serialnumber" ehealth-platform
