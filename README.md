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


## Directory Structure
All directories (with the following exceptions) are microservices.

### `scripts`
Contains scripts for setting up the project.

```
# Generate a new age key for secret encryption.
./scripts/generate_age_key.sh
```

### `secrets`
Contains secrets for the project.

### `tf_backend`
Contains the Terraform configuration for the Terraform state backend. 
For this project, the terraform backend is stored in a Google Cloud Storage bucket.

[^1]: OpenTofu 1.8.0 introduces [static variable evaluation](https://opentofu.org/blog/opentofu-1-8-0/), which we use for the project.