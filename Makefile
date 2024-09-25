SHELL := /bin/bash
MAKEFLAGS += --no-print-directory

.PHONY: help deploy_tf_backend destroy_tf_backend



help: ## Display this help text
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[$$()% 0-9a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)


urls: ## Get the URL endpoints of all deployed resources.
	@echo "FRONTEND_URL: $$(cd frontend && $(MAKE) url)"
	@echo "BACKEND_URL: $$(cd backend && $(MAKE) url)"

encrypt: ## Encrypt the secrets file
	./scripts/secret.sh encrypt

decrypt: ## Decrypt the secrets file
	./scripts/secret.sh decrypt


## Repo-wide
deploy: ## Deploy all infrastructure and code
	$(MAKE) -C docker_registry deploy
	$(MAKE) -C backend deploy
	$(MAKE) -C frontend deploy

# Recommended to destroy services in the reverse order of deployment.
destroy: ## Destroy all infrastructure and code
	$(MAKE) -C frontend destroy 
	$(MAKE) -C backend destroy
	$(MAKE) -C docker_registry destroy

##
## Terraform backend
##

deploy_tf_backend: ## Deploy the OpenTofu/Terraform backend to GCP
	. ./source.sh && \
		unset TF_WORKSPACE && \
		cd tf_backend && \
		tofu init && \
		tofu apply -auto-approve

destroy_tf_backend: ## Destroy the OpenTofu/Terraform backend on GCP
	. ./source.sh && \
		unset TF_WORKSPACE && \
		cd tf_backend && \
		tofu destroy -auto-approve