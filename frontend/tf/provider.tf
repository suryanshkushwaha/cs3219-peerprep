variable "service_name" {
    type = string
    description = "Name of the service. This name should be unique within the project."
}

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.3.0"
    }
  }

  backend "gcs" {
    bucket  = var.bucket_name
    prefix  = "terraform/state/${var.service_name}"
  }
}