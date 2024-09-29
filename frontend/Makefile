SHELL=/bin/bash
help: ## Show this help
	@echo "Usage: make [target]"
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

local: ## Run the code locally
	export VITE_BACKEND_SERVICE_URL="$(BACKEND_LOCAL_SERVICE_URL)" && \
		yarn run dev