SHELL=/bin/bash

help: ## Show this help
	@echo "Usage: make [target]"
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

docker_build: ## Build the Docker image
	docker build -t user-service .

docker_run: ## Run the Docker container
	docker run \
		-p 3001:3001 \
		--env-file .env \
		user-service
