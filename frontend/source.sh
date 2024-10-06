#!/bin/bash
PWD="$(git rev-parse --show-toplevel)"/frontend
# Get global environment variables for project
source $PWD/../source.sh

export TF_VAR_service_name=frontend
