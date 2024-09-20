SHELL=/bin/bash

deploy: infra_deploy code_deploy
destroy: infra_destroy

code_build:
	. ./source.sh && \
		docker build -t $$DOCKER_IMAGE_NAME .

code_deploy: code_build infra_deploy
	. ./source.sh && \
		docker push $$DOCKER_IMAGE_NAME && \
		gcloud run deploy $$CLOUD_RUN_SERVICE_NAME --project $$GCLOUD_PROJECT --image $$DOCKER_IMAGE_NAME --port $$EXPOSED_PORT --region $$GCLOUD_REGION --allow-unauthenticated
	
infra_deploy:
	. ./source.sh && \
		cd tf && \
		tofu init && \
		tofu workspace select -or-create $$TERRAFORM_WORKSPACE && \
		tofu apply -auto-approve

infra_destroy:
	. ./source.sh &&
		tofu workspace select -or-create $$TERRAFORM_WORKSPACE && \
		cd tf && \
		tofu destroy -auto-approve

api_url:
	@ . ./source.sh && \
		cd tf && \
		tofu workspace select -or-create $$TERRAFORM_WORKSPACE && \
		tofu output -raw service_url