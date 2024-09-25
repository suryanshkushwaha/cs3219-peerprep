[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/bzPrOe11)
# CS3219 Project (PeerPrep) - AY2425S1
## Group: G10

## Dependencies
| Thing                                            | Version |
| ------------------------------------------------ | ------- |
| [gcloud](https://cloud.google.com/sdk/gcloud)    |         |
| [OpenTofu](https://github.com/opentofu/opentofu) | 1.8[^1] |
| [sops](https://github.com/getsops/sops)          | 3.9     |
| [age](https://github.com/FiloSottile/age)        | 1       |
| Make                                             | 4       |
| Bash                                             | 5       |

## Developer Guide

Here are the scripts relevant in deploying the project.

## Repository Structure

Except the directories `.github`, `ci`, `scripts`, `secrets`, `tf_backend`, all directories are services.

Each service has:
-  A `tf` directory, which contains the Terraform configuration for the service.
-  A `source.sh` file, which sources the base directory's `source.sh` file and adds on any additional environment variables required by the service.
-  A `Makefile` which contains the commands to deploy, test and destroy the service.

Here are the relevant make targets for each service. For some services, the `Makefile` may omit some of these targets (e.g. `docker_registry` service has no code to build or deploy.)

```sh
Usage: make [target]
Targets:
  help                 Show this help
  local                Run the code locally
  deploy               Deploy the code and infrastructure
  destroy              Destroy the infrastructure
  test                 Run the tests
  code_build           Build the code
  code_deploy          Deploy the code
  infra_deploy         Deploy the infrastructure
  infra_destroy        Destroy the infrastructure
  url                  Get the service URL
```

## Developing
### Code and Infrastructure Deployment

There are two ways to deploy the project to the cloud. Note that every branch creates its own separate deployment copy.

First, you can simply push to your feature branch, and the CI/CD pipeline will deploy a copy of the infrastructure and the code to the cloud.

To deploy all infrastructure and code on the command line, you can run the following command:
```bash
# Decrypt secrets
make decrypt # You need your age key in the sops file, contact Yongbeom for how to do this.

# In the base directory,
make deploy

# This is equivalent to running
make deploy # in docker_registry
make deploy # in frontend 
make deploy # in backend
```

To destroy your deployment, you can do:
```bash
# Decrypt secrets
make decrypt # You need your age key in the sops file, contact Yongbeom for how to do this.

# In the base directory,
make destroy

# This is equivalent to running
make destroy # in docker_registry
make destroy # in frontend 
make destroy # in backend
```


### Code Deployment

Once you have deployed the infrastructure, you do not need to do so again, you can simply update our deployment by deploying code.

To deploy the code, you can do:
```bash
# deploy frontend code
make code_deploy # in frontend directory

# deploy backend code
make code_deploy # in backend directory
```

### Local Deployment

Alternatively, you can deploy the code locally.

Run the following commands (in separate terminals) to deploy the frontend and backend code locally.
```bash
# deploy frontend code
make local

# deploy backend code
make local
```

## Non-Service Directories
All direct subdirectories of the project base directory (with the following exceptions) are microservices.

Additional information about some directories is provided below.
### `scripts`
Contains scripts for setting up the project.

Usage:
```
# Generate a new age key for secret encryption.
./scripts/generate_age_key.sh
# Encrypt all secret files
./scripts/secret.sh encrypt
# Decrypt all secret files
./scripts/secret.sh decrypt
```
### `secrets`
Contains secrets for the project.

### `tf_backend`
Contains the Terraform configuration for the Terraform state backend. 
For this project, the terraform backend is stored in a Google Cloud Storage bucket.


[^1]: OpenTofu 1.8.0 introduces [static variable evaluation](https://opentofu.org/blog/opentofu-1-8-0/), which we use for the project.