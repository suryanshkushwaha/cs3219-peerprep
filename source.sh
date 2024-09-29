#!/bin/bash
PWD="$(git rev-parse --show-toplevel)"

set -o allexport

# Get the environment variables from the .env file in the root directory
source "$PWD/.env"


set +o allexport