SHELL=/bin/bash

help: ## Show this help
	@echo "Usage: make [target]"
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

local:  ## Run the code locally
	. ./source.sh && \
		yarn start
	echo "Service is running on http://localhost:$$EXPOSED_PORT"

local_url: ## Get the local service URL
	@ . ./source.sh && \
		echo http://localhost:$$EXPOSED_PORT