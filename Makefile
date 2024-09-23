SHELL := /bin/bash
MAKEFLAGS += --no-print-directory

.PHONY: help gcloud_auth deploy_tf_backend destroy_tf_backend



help: ## Display this help text
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[$$()% 0-9a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)


urls: ## Get the URL endpoints of all deployed resources.
	@echo "FRONTEND_URL: $$(cd frontend && $(MAKE) url)"
	@echo "BACKEND_URL: $$(cd backend && $(MAKE) url)"

##
## Google Cloud CLI
##

gcloud_auth: ## Authenticate with gcloud
	. source.sh && \
		gcloud auth activate-service-account --key-file=$$GOOGLE_APPLICATION_CREDENTIALS && \
		gcloud auth configure-docker $$GCLOUD_REGION-docker.pkg.dev --quiet

##
## Global Terraform Infrastructure
##

deploy_infra: ## Deploy Global OpenTofu/Terraform infrastructure
	. source.sh && \
		cd tf && \
		tofu init && \
		tofu workspace select -or-create $$TERRAFORM_WORKSPACE && \
		tofu apply -auto-approve

destroy_infra: ## Destroy Global OpenTofu/Terraform infrastructure
	. source.sh && \
		cd tf && \
		tofu init && \
		tofu workspace select -or-create $$TERRAFORM_WORKSPACE && \
		tofu destroy -auto-approve

##
## Terraform backend
##

deploy_tf_backend: ## Deploy the OpenTofu/Terraform backend to GCP
	. source.sh && \
		unset TF_WORKSPACE && \
		cd tf_backend && \
		tofu init && \
		tofu apply -auto-approve

destroy_tf_backend: ## Destroy the OpenTofu/Terraform backend on GCP
	. source.sh && \
		unset TF_WORKSPACE && \
		cd tf_backend && \
		tofu destroy -auto-approve