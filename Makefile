gcloud_auth:
	set -o allexport && source ./.env && set +o allexport && \
		gcloud auth activate-service-account --key-file=$$GOOGLE_APPLICATION_CREDENTIALS
		$$SHELL

deploy_tf_backend:
	set -o allexport && source ./.env && set +o allexport && \
	export GOOGLE_APPLICATION_CREDENTIALS=$(shell realpath ./secrets/gcp_credentials.json) && \
		cd tf_backend && \
		tofu init && \
		tofu apply -auto-approve \
			-var="bucket_name=$$TF_BACKEND_BUCKET_NAME" \
			-var="project=$$TF_PROJECT_NAME"

destroy_tf_backend:
	set -o allexport && source ./.env && set +o allexport && \
	export GOOGLE_APPLICATION_CREDENTIALS=$(shell realpath ./secrets/gcp_credentials.json) && \
		cd tf_backend && \
		tofu destroy -auto-approve \
			-var="bucket_name=$$TF_BACKEND_BUCKET_NAME" \
			-var="project=$$TF_PROJECT_NAME"