deploy: infra_deploy code_deploy
destroy: infra_destroy

code_build:
	yarn run build

code_deploy: code_build
	. scripts/env.sh && \
		bucket_url=$$(cd tf && tofu output -raw frontend_bucket_url) && \
		gsutil -m rm $$bucket_url/'**' || true && \
		gsutil -m cp -r dist/** $$bucket_url && \
		cd tf && tofu output
	
infra_deploy: tf/*
	. scripts/env.sh && \
		cd tf && \
		tofu init && \
		tofu apply -auto-approve \

infra_destroy:
	. scripts/env.sh && \
		cd tf && \
		tofu destroy -auto-approve \