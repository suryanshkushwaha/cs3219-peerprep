#!/bin/bash
set -o allexport

# Get the environment variables from the .env file in the root directory
source $(git rev-parse --show-toplevel)/.env

# Environment varaibles for terraform input variables
TF_VAR_backend_gcs_bucket=$TF_BACKEND_BUCKET_NAME
TF_VAR_service_name=frontend
TF_VAR_project=$TF_PROJECT_NAME

set +o allexport
