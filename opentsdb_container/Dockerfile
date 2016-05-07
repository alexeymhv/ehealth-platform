FROM petergrace/opentsdb-docker

ADD script/create_opentsdb_metrics.sh /opt/

#RUN /opt/create_opentsdb_metrics.sh /opt/opentsdb/opentsdb-2.2.0 accelerometer.data
#RUN /opt/create_opentsdb_metrics.sh /opt/opentsdb/opentsdb-2.2.0 pulsometer.data
#RUN /opt/create_opentsdb_metrics.sh /opt/opentsdb/opentsdb-2.2.0 gsr.data
#RUN /opt/create_opentsdb_metrics.sh /opt/opentsdb/opentsdb-2.2.0 eeg.data

EXPOSE 4242

CMD ["/bin/bash"]

