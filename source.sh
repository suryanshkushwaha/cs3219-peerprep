#!/bin/bash
PWD="$(git rev-parse --show-toplevel)"

set -o allexport

## Shared Environment Variables for the project
GOOGLE_APPLICATION_CREDENTIALS=./secrets/gcp_credentials.json
GCLOUD_PROJECT=cs3219-ay2425s1-project-g10
GCLOUD_REGION=us-central1
GCLOUD_ZONE=us-central1-c
GCLOUD_REPOSITORY_ID=cs3219-ay2425s1-project-g10

# Terraform backend variables
TF_BACKEND_BUCKET_NAME=${GCLOUD_PROJECT}-tfstate


set +o allexport