#!/bin/bash
# Get global environment variables for project
source ../source.sh

set -o allexport

. ./env

SERVICE_NAME=backend

EXPOSED_PORT=8080

set +o allexport
