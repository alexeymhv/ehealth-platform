FROM node

RUN apt-get -y update && apt-get -y install curl vim

#RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
#RUN apt-get -y install nodejs \
#			build-essential

#RUN npm install npm -g

RUN mkdir /opt/ehealth-platform

RUN cd /opt/ehealth-platform && npm install opentsdb-query@0.0.2 \
		opentsdb \
		opentsdb-client \
		serialport@3.1.1 \
 		fft-js \
		socket.io \
		mysql	  \
		password-hash

ADD application/ /opt/ehealth-platform

EXPOSE 3000

WORKDIR /opt/ehealth-platform

#CMD ["/bin/bash"]
CMD ["node","/opt/ehealth-platform/server_ehealth_docker.js"]
