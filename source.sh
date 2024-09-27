#!/bin/bash
PWD="$(git rev-parse --show-toplevel)"

set -o allexport

# Get the environment variables from the .env file in the root directory
source $PWD/.env

GOOGLE_APPLICATION_CREDENTIALS=$(realpath $PWD/$GOOGLE_APPLICATION_CREDENTIALS)

# Environment varaibles for terraform input variables
TF_VAR_backend_gcs_bucket=$TF_BACKEND_BUCKET_NAME
TF_VAR_project=$GCLOUD_PROJECT
TF_VAR_region=$GCLOUD_REGION
TF_VAR_zone=$GCLOUD_ZONE

# Environment
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ $BRANCH == "main" ]]; then
  ENV="production"
elif [[ $BRANCH == "dev" ]]; then
  ENV="staging"
else
  ENV=$(echo $BRANCH | tr '[:upper:]' '[:lower:]' | tr "/" "-")
fi

# Stupid issue: TF_WORKSPACE environment variable is literally broken, WTF?
# https://discuss.hashicorp.com/t/help-using-terraform-workspaces-in-an-automation-pipeline-with-tf-workspace-currently-selected-workspace-x-does-not-exist/40676
TERRAFORM_WORKSPACE=$ENV

GCLOUD_REPOSITORY_URL=${GCLOUD_REGION}-docker.pkg.dev/${GCLOUD_PROJECT}/${ENV}

# Authenticate into gcloud
gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
gcloud auth configure-docker $GCLOUD_REGION-docker.pkg.dev --quiet

set +o allexport