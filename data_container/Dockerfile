# The base image has to be java:8 as Jira requires Oracle Java rather than openjdk.
# This is a data container. It uses a set of commands from the Jira Dockerfile in order to ensure UIDs/GIDs match.
FROM java:8  

RUN apt-get -y update && apt-get -y install wget

RUN cd /opt && wget http://www-eu.apache.org/dist/hbase/stable/hbase-1.1.4-bin.tar.gz && \
        tar xzvf hbase-1.1.4-bin.tar.gz
# Set volumes
VOLUME /opt/
 
# Consider running "USER jira" to limit the access of the containers default user.
CMD ["echo", "OPENTSDB DATA CONTAINER"]
