#!/bin/bash
# Small script to create a table in HBase DB

OPENTSDB_HOME=$1
TABLE_NAME=$2

$OPENTSDB_HOME/build/tsdb mkmetric $TABLE_NAME
