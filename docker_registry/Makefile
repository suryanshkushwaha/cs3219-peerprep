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

deploy: infra_deploy ## Deploy all
destroy: infra_destroy ## Destroy all


test: ## Run the tests
	@echo $(BACKEND_CLOUD_SERVICE_URL)
	
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