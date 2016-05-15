FROM node

RUN apt-get -y update && apt-get -y install curl vim

RUN mkdir /opt/ehealth-platform

RUN cd /opt/ehealth-platform && npm install opentsdb-query@0.0.2 \
		opentsdb \
		opentsdb-client \
		serialport@3.1.1 \
 		fft-js \
		socket.io \
		mysql	  \
		password-hash \
		date-now

ADD application/ /opt/ehealth-platform

EXPOSE 3000

WORKDIR /opt/ehealth-platform

CMD ["node","/opt/ehealth-platform/server_ehealth.js"]
