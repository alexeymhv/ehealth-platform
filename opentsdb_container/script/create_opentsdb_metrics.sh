#!/bin/bash
# Small script to create a table in HBase DB
OPENTSDB_HOME=/opt/opentsdb/opentsdb-2.2.0/build
 
ACCELEROMETER_DB_NAME='accelerometer.data'
PULSOMETER_DB_NAME='pulsometer.data'
GSR_DB_NAME='gsr.data'
EEGSMT_DB_NAME='eeg.data'

$OPENTSDB_HOME/tsdb mkmetric $ACCELEROMETER_DB_NAME
$OPENTSDB_HOME/tsdb mkmetric $PULSOMETER_DB_NAME
$OPENTSDB_HOME/tsdb mkmetric $GSR_DB_NAME
$OPENTSDB_HOME/tsdb mkmetric $EEGSMT_DB_NAME
