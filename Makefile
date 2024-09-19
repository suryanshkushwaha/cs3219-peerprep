.PHONY: help gcloud_auth deploy_tf_backend destroy_tf_backend


help: ## Display this help text
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[$$()% 0-9a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)


##
## Google Cloud CLI
##

gcloud_auth: ## Authenticate with gcloud and launch a new shell.
	set -o allexport && source ./.env && set +o allexport && \
		gcloud auth activate-service-account --key-file=$$GOOGLE_APPLICATION_CREDENTIALS
		$$SHELL

##
## Terraform backend
##

deploy_tf_backend: ## Deploy the OpenTofu/Terraform backend to GCP
	set -o allexport && source ./.env && set +o allexport && \
	export GOOGLE_APPLICATION_CREDENTIALS=$(shell realpath ./secrets/gcp_credentials.json) && \
		cd tf_backend && \
		tofu init && \
		tofu apply -auto-approve \
			-var="bucket_name=$$TF_BACKEND_BUCKET_NAME" \
			-var="project=$$TF_PROJECT_NAME"

destroy_tf_backend: ## Destroy the OpenTofu/Terraform backend on GCP
	set -o allexport && source ./.env && set +o allexport && \
	export GOOGLE_APPLICATION_CREDENTIALS=$(shell realpath ./secrets/gcp_credentials.json) && \
		cd tf_backend && \
		tofu destroy -auto-approve \
			-var="bucket_name=$$TF_BACKEND_BUCKET_NAME" \
			-var="project=$$TF_PROJECT_NAME"