SHELL=/bin/bash

help: ## Show this help
	@echo "Usage: make [target]"
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

local: code_build ## Run the code locally
	. ./source.sh && \
		docker run -p $$EXPOSED_PORT:$$EXPOSED_PORT $$DOCKER_IMAGE_NAME
	echo "Service is running on http://localhost:$$EXPOSED_PORT"

deploy: infra_deploy code_deploy ## Deploy the code and infrastructure
destroy: infra_destroy ## Destroy the infrastructure

code_build: ## Build the code
	. ./source.sh && \
		docker build -t $$DOCKER_IMAGE_NAME --build-arg="PORT=$$EXPOSED_PORT" .

code_deploy: code_build infra_deploy ## Deploy the code
	. ./source.sh && \
		docker push $$DOCKER_IMAGE_NAME && \
		gcloud run deploy $$CLOUD_RUN_SERVICE_NAME --project $$GCLOUD_PROJECT --image $$DOCKER_IMAGE_NAME --port $$EXPOSED_PORT --region $$GCLOUD_REGION --allow-unauthenticated
	
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
	@ . ./source.sh && \
		cd tf && \
		tofu init &> /dev/null && \
		tofu workspace select -or-create $$TERRAFORM_WORKSPACE &> /dev/null && \
		tofu output -raw service_url

local_url: ## Get the local service URL
	@ . ./source.sh && \
		echo http://localhost:$$EXPOSED_PORT