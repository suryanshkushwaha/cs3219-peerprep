SHELL=/bin/bash

BACKEND_CLOUD_SERVICE_URL=$(shell $(MAKE) -C ../backend -s url | head -n 2)
BACKEND_LOCAL_SERVICE_URL=$(shell $(MAKE) -C ../backend -s local_url)

help: ## Show this help
	@echo "Usage: make [target]"
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

local: ## Run the code locally
	export VITE_BACKEND_SERVICE_URL="$(BACKEND_LOCAL_SERVICE_URL)" && \
		yarn run dev

deploy: infra_deploy code_deploy ## Deploy the code and infrastructure
destroy: infra_destroy ## Destroy the infrastructure


test: ## Run the tests
	@echo $(BACKEND_CLOUD_SERVICE_URL)

code_build: ## Build the code
	@if [[ "$(BACKEND_CLOUD_SERVICE_URL)" == *"No outputs found"* ]] ; then \
		echo "Backend service URL not found, please go to the backend service and deploy it first."; \
		exit 1; \
	fi
	export VITE_BACKEND_SERVICE_URL=$(BACKEND_CLOUD_SERVICE_URL) && \
		yarn && \
		yarn run build

code_deploy: code_build ## Deploy the code
	. ./source.sh && \
		bucket_url=$$(cd tf && tofu output -raw frontend_bucket_url) && \
		gsutil -m rm $$bucket_url/'**' || true && \
		gsutil -m cp -r dist/** $$bucket_url && \
		cd tf && tofu output
	
infra_deploy: ## Deploy the infrastructure
	. ./source.sh && \
		cd tf && \
		tofu init && \
		tofu workspace select -or-create $$TERRAFORM_WORKSPACE && \
		tofu apply -auto-approve

infra_destroy: ## Destroy the infrastructure
	. ./source.sh && \
		cd tf && \
		tofu init && \
		tofu workspace select -or-create $$TERRAFORM_WORKSPACE && \
		tofu destroy -auto-approve

url: ## Get the service URL
	@. ./source.sh && \
		cd tf && \
		tofu init &> /dev/null && \
		tofu workspace select -or-create $$TERRAFORM_WORKSPACE &> /dev/null && \
		tofu output -raw frontend_bucket_website_url