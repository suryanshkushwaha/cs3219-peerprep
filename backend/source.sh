#!/bin/bash
# Get global environment variables for project
source ../source.sh

set -o allexport

SERVICE_NAME=backend

GCLOUD_REPOSITORY_URL=$(cd ../tf && tofu output -raw repository_url)
TF_VAR_service_name=${SERVICE_NAME}
DOCKER_IMAGE_NAME=${GCLOUD_REPOSITORY_URL}/${SERVICE_NAME}:$(git rev-parse HEAD)

CLOUD_RUN_SERVICE_NAME=${GCLOUD_PROJECT}-${SERVICE_NAME}-${ENV}
TF_VAR_cloud_run_service_name=${CLOUD_RUN_SERVICE_NAME}

EXPOSED_PORT=8080

set +o allexport
