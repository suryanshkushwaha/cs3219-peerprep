variable "backend_gcs_bucket" {
  type = string
  description = "The name of the bucket for storing Terraform state"
}

variable "service_name" {
    type = string
    description = "Name of the service. This name should be unique within the project."
}

variable "project" {
  type = string
  description = "Name of the project. This value should be shared within the entire repository."
}

variable "region" {
  type = string
}

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.3.0"
    }
  }

  backend "gcs" {
    bucket  = var.backend_gcs_bucket
    prefix  = "terraform/state/${var.service_name}"
  }
}

provider "google" {
  # Configuration options
  project = var.project

  region = var.region

  default_labels = {
    "managed-by"  = "opentofu"
    "project"     = var.project
    # "environment" = "production" # TODO: This depends on the environment/branch.
  }
}