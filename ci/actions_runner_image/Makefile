.PHONY: all build push

all: build push

build:
	docker build -t kimyongbeom/peerprep-actions-runner:latest .

push:
	docker push kimyongbeom/peerprep-actions-runner:latest

run:
	docker run -it \
		-v /var/run/docker.sock:/var/run/docker.sock \
		-v $(shell git rev-parse --show-toplevel):/home \
		--privileged \
		-e AGE_SECRET_KEY=$$(tail -n1 $${XDG_CONFIG_HOME:-$$HOME/.config}/sops/age/keys.txt) \
		kimyongbeom/peerprep-actions-runner:latest