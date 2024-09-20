SHELL=/bin/bash

deploy: infra_deploy code_deploy
destroy: infra_destroy

BACKEND_SERVICE_URL=$(shell cd ../backend && $(MAKE) -s api_url | head -n 2)
	
serve:
	@if [[ "$(BACKEND_SERVICE_URL)" == *"No outputs found"* ]] ; then \
		echo "Backend service URL not found, please go to the backend service and deploy it first."; \
		exit 1; \
	fi
	export VITE_BACKEND_SERVICE_URL=$(BACKEND_SERVICE_URL) && \
		yarn run dev

code_build:
	@if [[ "$(BACKEND_SERVICE_URL)" == *"No outputs found"* ]] ; then \
		echo "Backend service URL not found, please go to the backend service and deploy it first."; \
		exit 1; \
	fi
	export VITE_BACKEND_SERVICE_URL=$(BACKEND_SERVICE_URL) && \
		yarn run build

code_deploy: code_build
	. ./source.sh && \
		bucket_url=$$(cd tf && tofu output -raw frontend_bucket_url) && \
		gsutil -m rm $$bucket_url/'**' || true && \
		gsutil -m cp -r dist/** $$bucket_url && \
		cd tf && tofu output
	
infra_deploy: tf/*
	. ./source.sh && \
		cd tf && \
		tofu init && \
		tofu apply -auto-approve \

infra_destroy:
	. ./source.sh && \
		cd tf && \
		tofu destroy -auto-approve \