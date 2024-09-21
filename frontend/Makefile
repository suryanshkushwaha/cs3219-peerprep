SHELL=/bin/bash

deploy: infra_deploy code_deploy
destroy: infra_destroy

BACKEND_SERVICE_URL=$(shell cd ../backend && $(MAKE) -s url | head -n 2)

test:
	@echo $(BACKEND_SERVICE_URL)

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
		yarn && \
		yarn run build

code_deploy: code_build
	. ./source.sh && \
		bucket_url=$$(cd tf && tofu output -raw frontend_bucket_url) && \
		gsutil -m rm $$bucket_url/'**' || true && \
		gsutil -m cp -r dist/** $$bucket_url && \
		cd tf && tofu output
	
infra_deploy:
	. ./source.sh && \
		cd tf && \
		tofu init && \
		tofu workspace select -or-create $$TERRAFORM_WORKSPACE && \
		tofu apply -auto-approve \

infra_destroy:
	. ./source.sh && \
		cd tf && \
		tofu init && \
		tofu workspace select -or-create $$TERRAFORM_WORKSPACE && \	
		tofu destroy -auto-approve \

url:
	@. ./source.sh && \
		cd tf && \
		tofu init &> /dev/null && \
		tofu workspace select -or-create $$TERRAFORM_WORKSPACE &> /dev/null && \
		tofu output -raw frontend_bucket_website_url