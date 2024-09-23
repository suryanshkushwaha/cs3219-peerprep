#!/bin/bash
# Get global environment variables for project
source ../source.sh

set -o allexport

SERVICE_NAME=backend

TF_VAR_service_name=${SERVICE_NAME}
DOCKER_IMAGE_NAME=${GCLOUD_REPOSITORY_URL}/${SERVICE_NAME}:$(git rev-parse HEAD)

CLOUD_RUN_SERVICE_NAME=$(echo ${GCLOUD_PROJECT}-${SERVICE_NAME}-${ENV} | head -c 49) # Max length is 50 characters
TF_VAR_cloud_run_service_name=${CLOUD_RUN_SERVICE_NAME}

EXPOSED_PORT=8080

set +o allexport
